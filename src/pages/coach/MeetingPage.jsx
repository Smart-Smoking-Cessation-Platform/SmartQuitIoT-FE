// src/pages/coach/MeetingPage.jsx
import React, { useEffect, useRef, useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import api from "@/api/appointments"; // wrapper that returns unwrapped data
import {
  Loader2,
  Video,
  Mic,
  MicOff,
  VideoOff,
  Phone,
  Timer,
  User,
  Maximize2,
} from "lucide-react";
import styles from "../../styles/MeetingPage.module.css";

export default function MeetingPage() {
  const { appointmentId: paramId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [tokenData, setTokenData] = useState(location.state?.tokenData || null);
  const [error, setError] = useState(null);

  const clientRef = useRef(null);
  const localTrackRefs = useRef({ videoTrack: null, audioTrack: null });
  const localDivRef = useRef(null);
  const REMOTE_MOUNT_ID = "remote-mount";

  // state of remote users: map uid -> { uid, hasVideo, hasAudio, name, isLocal }
  const [remoteUsers, setRemoteUsers] = useState({});
  const timerRef = useRef(null);
  const intervalRef = useRef(null);
  const joinTimeRef = useRef(null);

  const joiningRef = useRef(false); // <-- guard to prevent duplicate join attempts

  // UI states
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [timeLeftMs, setTimeLeftMs] = useState(null);

  const msUntilExpire = (expiresAt) => {
    if (!expiresAt) return null;
    const now = Date.now();
    if (typeof expiresAt === "number") {
      const t = expiresAt > 1e12 ? expiresAt : expiresAt * 1000;
      return Math.max(0, t - now);
    }
    const t = Date.parse(expiresAt);
    if (isNaN(t)) return null;
    return Math.max(0, t - now);
  };

  // ---------- timer helpers (moved outside useEffect so retry/cleanup can use them) ----------
  const startClock = (expiresAt) => {
    joinTimeRef.current = Date.now();
    setElapsedMs(0);
    const update = () => {
      setElapsedMs(Date.now() - (joinTimeRef.current || Date.now()));
      setTimeLeftMs(msUntilExpire(expiresAt));
    };
    update();
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(update, 1000);
  };

  const stopClock = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setElapsedMs(0);
    setTimeLeftMs(null);
  };

  // ---------- cleanup (define before useEffect to allow calling inside) ----------
  const cleanupAndLeave = async () => {
    try {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      const client = clientRef.current;
      const { audioTrack, videoTrack } = localTrackRefs.current || {};

      if (videoTrack) {
        try {
          await videoTrack.stop();
        } catch (e) {}
        try {
          videoTrack.close();
        } catch (e) {}
      }
      if (audioTrack) {
        try {
          await audioTrack.stop();
        } catch (e) {}
        try {
          audioTrack.close();
        } catch (e) {}
      }

      if (client) {
        try {
          await client.leave();
          console.debug("[Agora] client.leave() success");
        } catch (e) {
          console.warn("[Agora] client.leave() failed", e);
        }
      }
    } catch (e) {
      console.warn("cleanup error", e);
    } finally {
      clientRef.current = null;
      localTrackRefs.current = { audioTrack: null, videoTrack: null };
      if (localDivRef.current) localDivRef.current.innerHTML = "";
      const ph = document.getElementById(REMOTE_MOUNT_ID);
      if (ph) ph.innerHTML = "";
      setRemoteUsers({});
      stopClock();
    }
  };

  useEffect(() => {
    let mounted = true;

    const loadAndStart = async () => {
      setLoading(true);
      try {
        // 1) get token data if missing
        let td = tokenData;
        if (!td) {
          const id =
            paramId ||
            (location.state &&
              location.state.appointment &&
              location.state.appointment.id);
          if (!id) throw new Error("Missing appointment id / tokenData");
          const resp = await api.requestJoinToken(id);
          td = resp;
          if (!mounted) return;
          setTokenData(td);
        }

        const channel = td.channel;
        const token = td.token;
        const uid = td.uid ?? 0;
        const appId =
          import.meta.env.VITE_AGORA_APPID ||
          td.appId ||
          process.env.REACT_APP_AGORA_APPID;
        if (!appId) throw new Error("Missing Agora appId.");
        if (!channel) throw new Error("Missing channel in token data.");

        // --- PATCH: prevent concurrent joins and implement retry on OPERATION_ABORTED ---
        if (joiningRef.current) {
          console.warn(
            "[Meeting] join already in progress — skipping duplicate call"
          );
          return;
        }
        joiningRef.current = true;

        // ensure we don't leave an old client hanging
        if (clientRef.current) {
          try {
            await cleanupAndLeave();
          } catch (e) {
            console.warn("[Meeting] cleanup before new join failed", e);
          }
        }

        // log token summary for debug (avoid printing full token in prod)
        console.debug("[Meeting] joining", {
          appId,
          channel,
          uid,
          tokenLen: token ? token.length : 0,
          expiresAt: td.expiresAt,
        });

        // helper: retry join once on cancel/operation aborted
        const tryJoinWithRetry = async (
          client,
          appId_,
          channel_,
          token_,
          uid_,
          attempts = 1
        ) => {
          try {
            await client.join(appId_, channel_, token_ || null, uid_);
            return;
          } catch (err) {
            const msg = String(err && err.message ? err.message : err);
            // transient: SDK cancelled previous join attempt -> retry
            if (
              attempts > 0 &&
              (msg.includes("OPERATION_ABORTED") ||
                msg.includes("cancel token"))
            ) {
              console.warn(
                "[Meeting] join failed transiently, retrying...",
                msg
              );
              await new Promise((r) => setTimeout(r, 500));
              return tryJoinWithRetry(
                client,
                appId_,
                channel_,
                token_,
                uid_,
                attempts - 1
              );
            }
            throw err;
          }
        };

        // create client and register handlers
        const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
        clientRef.current = client;

        client.on("user-published", async (user, mediaType) => {
          console.debug("[Agora] user-published", user.uid, mediaType);
          try {
            await client.subscribe(user, mediaType);
          } catch (err) {
            console.error("[Agora] subscribe error", err);
            return;
          }

          setRemoteUsers((prev) => ({
            ...prev,
            [user.uid]: {
              uid: user.uid,
              hasVideo: !!user.videoTrack,
              hasAudio: !!user.audioTrack,
              name: user?.userInfo?.name || `User ${user.uid}`,
              isLocal: false,
            },
          }));

          // mount remote into fixed REMOTE_MOUNT_ID
          let container = document.getElementById(REMOTE_MOUNT_ID);
          if (!container) {
            container = document.createElement("div");
            container.id = REMOTE_MOUNT_ID;
            document.body.appendChild(container);
          }

          if (mediaType === "video") {
            const remoteVideoTrack = user.videoTrack;
            if (container && remoteVideoTrack) {
              try {
                container.innerHTML = "";
                remoteVideoTrack.play(container);
              } catch (playErr) {
                console.warn("[Agora] remote play failed, fallback", playErr);
                try {
                  const v = document.createElement("video");
                  v.autoplay = true;
                  v.playsInline = true;
                  v.muted = false;
                  v.style.width = "100%";
                  v.style.height = "100%";
                  container.innerHTML = "";
                  container.appendChild(v);
                  remoteVideoTrack.play(v);
                } catch (err2) {
                  console.error("[Agora] fallback also failed", err2);
                }
              }
            }
          }

          if (mediaType === "audio") {
            const remoteAudioTrack = user.audioTrack;
            if (remoteAudioTrack) {
              try {
                remoteAudioTrack.play();
              } catch (e) {
                console.warn("[Agora] remote audio play failed", e);
              }
            }
          }
        });

        client.on("user-unpublished", (user, type) => {
          console.debug("[Agora] user-unpublished", user.uid, type);
          setRemoteUsers((prev) => {
            const copy = { ...prev };
            if (copy[user.uid]) {
              if (type === "video") copy[user.uid].hasVideo = false;
              if (type === "audio") copy[user.uid].hasAudio = false;
            }
            return copy;
          });
          const el = document.getElementById(REMOTE_MOUNT_ID);
          if (el) el.innerHTML = "";
        });

        client.on("connection-state-change", (cur, rev) => {
          console.debug("[Agora] connection-state-change", cur, rev);
        });

        client.on("token-privilege-will-expire", () => {
          console.warn(
            "[Agora] token will expire soon - request new token from server."
          );
        });

        // JOIN with retry helper
        await tryJoinWithRetry(client, appId, channel, token, uid, 1);

        // create local tracks
        const [microphoneTrack, cameraTrack] = await Promise.all([
          AgoraRTC.createMicrophoneAudioTrack(),
          AgoraRTC.createCameraVideoTrack({ encoderConfig: "720p" }),
        ]);
        localTrackRefs.current = {
          audioTrack: microphoneTrack,
          videoTrack: cameraTrack,
        };

        // preview local
        if (localDivRef.current && cameraTrack) {
          try {
            localDivRef.current.innerHTML = "";
            cameraTrack.play(localDivRef.current);
          } catch (err) {
            console.warn("[Agora] local preview play failed", err);
          }
        }

        // publish local
        try {
          await client.publish([microphoneTrack, cameraTrack]);
          console.debug("[Agora] published local tracks");
        } catch (pubErr) {
          console.warn("[Agora] publish failed", pubErr);
        }

        // register local user in map (so UI shows "You" tile)
        setRemoteUsers((prev) => ({
          ...prev,
          [uid]: {
            uid,
            hasVideo: !!cameraTrack,
            hasAudio: !!microphoneTrack,
            name: "You",
            isLocal: true,
          },
        }));

        // start timers
        startClock(td.expiresAt);

        // auto-leave safety
        if (td.expiresAt) {
          const ms = msUntilExpire(td.expiresAt);
          if (ms > 0) {
            timerRef.current = setTimeout(() => {
              alert("Session expired");
              cleanupAndLeave();
              navigate(-1);
            }, ms + 500);
          }
        }
      } catch (err) {
        console.error("Meeting init error", err);
        if (mounted) setError(err.message || String(err));
      } finally {
        joiningRef.current = false; // <-- release guard
        if (mounted) setLoading(false);
      }
    }; // end loadAndStart

    loadAndStart();

    return () => {
      mounted = false;
      stopClock();
      // Don't await cleanup in unmount callback
      cleanupAndLeave();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // toggle mic
  const toggleMic = async () => {
    const t = localTrackRefs.current.audioTrack;
    if (!t) return;
    try {
      await t.setEnabled(!micOn);
      setMicOn((s) => !s);
    } catch (e) {
      console.warn("toggleMic failed", e);
    }
  };

  // toggle cam
  const toggleCam = async () => {
    const t = localTrackRefs.current.videoTrack;
    if (!t) return;
    try {
      await t.setEnabled(!camOn);
    } catch (e) {
      console.warn("toggleCam failed", e);
    }
    setCamOn((s) => !s);
    setRemoteUsers((prev) => {
      const copy = { ...prev };
      const localUid = tokenData?.uid ?? 0;
      if (copy[localUid]) copy[localUid].hasVideo = !copy[localUid].hasVideo;
      return copy;
    });
  };

  const leaveAndBack = async () => {
    await cleanupAndLeave();
    navigate(-1);
  };

  const formatMs = (ms) => {
    if (ms == null) return "--:--";
    const total = Math.floor(ms / 1000);
    const mm = String(Math.floor(total / 60)).padStart(2, "0");
    const ss = String(total % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <Loader2 className="w-6 h-6 inline-block mr-2" /> Preparing meeting...
      </div>
    );
  }

  if (error) {
    return <div className={styles.error}>Error: {String(error)}</div>;
  }

  if (!tokenData) {
    return <div className={styles.error}>No token available</div>;
  }

  const localUid = tokenData.uid ?? 0;
  const remoteList = Object.values(remoteUsers).filter((u) => !u.isLocal);
  const anyRemote = remoteList.length > 0;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Video />
          <h2 className={styles.title}>
            Meeting — {paramId || tokenData.channel}
          </h2>
        </div>

        <div className={styles.headerRight}>
          <div className={styles.timer}>
            <Timer />
            <span style={{ marginLeft: 8 }}>
              {formatMs(elapsedMs)} | left{" "}
              {timeLeftMs != null ? formatMs(timeLeftMs) : "N/A"}
            </span>
          </div>
          <div
            className={styles.participantCount}
            style={{
              display: "flex",
              gap: 6,
              alignItems: "center",
              padding: "6px 10px",
              borderRadius: 8,
              background: "#fff7ed",
              color: "#663c00",
            }}
          >
            <User />
            <span>{1 + remoteList.length}</span>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.gridSideBySide}>
          {/* Left: Local */}
          <div className={styles.tile}>
            <div className={styles.tileHeader}>
              <div>You</div>
              <div className={styles.tileBadge}>Local</div>
            </div>
            <div
              id={`local-mount`}
              ref={localDivRef}
              className={styles.tileInner}
            />
          </div>

          {/* Right: Remote */}
          <div className={styles.tile}>
            <div className={styles.tileHeader}>
              <div>
                {anyRemote
                  ? remoteList[0].name || `User ${remoteList[0].uid}`
                  : "Waiting for participant"}
              </div>
              <div className={styles.tileBadge}>Remote</div>
            </div>
            <div id={REMOTE_MOUNT_ID} className={styles.tileInner}>
              {!anyRemote && (
                <div className={styles.placeholder}>
                  <User size={48} />
                  <div style={{ fontSize: 18, fontWeight: 700 }}>
                    Waiting for participant
                  </div>
                  <div className={styles.placeholderName}>
                    Participant chưa vào hoặc chưa bật video
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.controlsWrap}>
          <div className={styles.controls}>
            <button
              className={styles.controlBtn}
              onClick={toggleMic}
              title={micOn ? "Mute" : "Unmute"}
            >
              {micOn ? <Mic /> : <MicOff />}
            </button>

            <button
              className={styles.controlBtn}
              onClick={toggleCam}
              title={camOn ? "Turn camera off" : "Turn camera on"}
            >
              {camOn ? <Video /> : <VideoOff />}
            </button>

            <button
              className={`${styles.controlBtn} ${styles.leaveBtn}`}
              onClick={leaveAndBack}
              title="Leave"
            >
              <Phone />
            </button>

            <button
              className={styles.controlBtn}
              onClick={() => {
                /* optional fullscreen */
              }}
              title="Toggle fullscreen"
            >
              <Maximize2 />
            </button>
          </div>

          <div className={styles.meta}>
            <div>
              <strong>Channel:</strong> {tokenData.channel}
            </div>
            <div>
              <strong>UID:</strong> {tokenData.uid}
            </div>
            <div>
              <strong>Expires:</strong>{" "}
              {tokenData.expiresAt
                ? new Date(tokenData.expiresAt).toString()
                : "N/A"}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
