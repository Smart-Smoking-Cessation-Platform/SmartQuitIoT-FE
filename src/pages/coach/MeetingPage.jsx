// src/pages/coach/MeetingPage.jsx
import React, { useEffect, useRef, useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import api from "@/api/appointments"; // wrapper that returns unwrapped data
import { uploadUnsigned } from "@/services/uploadService";
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
  const [appointmentData, setAppointmentData] = useState(
    location.state?.appointment || null
  );
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

  // Snapshot states
  const [snapshots, setSnapshots] = useState([]);
  const snapshotTimersRef = useRef([]);
  const hasStartedSnapshotsRef = useRef(false);

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

  // ---------- Snapshot helpers ----------

  // Parse appointment start time
  const parseLocalDateTime = (dateStr, timeStr) => {
    try {
      const [y, m, d] = (dateStr || "").split("-").map((n) => parseInt(n, 10));
      const [hh, mm] = (timeStr || "00:00")
        .split(":")
        .map((n) => parseInt(n, 10));
      if (!y || !m || !d || isNaN(hh) || isNaN(mm)) return null;
      return new Date(y, m - 1, d, hh, mm, 0, 0);
    } catch (e) {
      return null;
    }
  };

  // Backup snapshot vào localStorage
  const saveSnapshotToLocalStorage = (appointmentId, url) => {
    try {
      const key = `snapshots_${appointmentId}`;
      const existing = JSON.parse(localStorage.getItem(key) || "[]");
      existing.push({ url, timestamp: Date.now() });
      localStorage.setItem(key, JSON.stringify(existing));
    } catch (e) {
      console.error("Save to localStorage failed:", e);
    }
  };

  // Retry snapshots từ localStorage
  const retryFailedSnapshots = async (appointmentId) => {
    try {
      const key = `snapshots_${appointmentId}`;
      const stored = JSON.parse(localStorage.getItem(key) || "[]");

      if (stored.length > 0) {
        const urls = stored.map((s) => s.url);
        await api.saveAppointmentSnapshots(appointmentId, urls);
        localStorage.removeItem(key);
        console.log("Retried and saved snapshots from localStorage");
      }
    } catch (e) {
      console.error("Retry snapshots failed:", e);
    }
  };

  // Capture snapshot từ cả 2 video (local + remote) - toàn cảnh
  const captureSnapshot = async () => {
    try {
      const localContainer = document.getElementById("local-mount");
      const remoteContainer = document.getElementById(REMOTE_MOUNT_ID);
      const localVideo = localContainer?.querySelector("video");
      const remoteVideo = remoteContainer?.querySelector("video");

      // Cần ít nhất 1 video để chụp
      if (!localVideo && !remoteVideo) {
        console.warn("No video available for snapshot");
        return null;
      }

      // Tạo canvas với kích thước lớn để chứa cả 2 video
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Kích thước mỗi video (giả sử 640x480 hoặc lấy từ video thực tế)
      const videoWidth = 640;
      const videoHeight = 480;
      const padding = 10;

      // Canvas layout: 2 video cạnh nhau hoặc chồng lên nhau
      if (localVideo && remoteVideo) {
        // Cả 2 video: đặt cạnh nhau
        canvas.width = videoWidth * 2 + padding * 3;
        canvas.height = videoHeight + padding * 2;

        // Background
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Vẽ local video (bên trái)
        if (localVideo.videoWidth > 0 && localVideo.readyState >= 2) {
          try {
            ctx.drawImage(
              localVideo,
              padding,
              padding,
              videoWidth,
              videoHeight
            );
            // Label
            ctx.fillStyle = "#FFFFFF";
            ctx.font = "16px Arial";
            ctx.fillText("Coach", padding + 10, padding + 30);
          } catch (e) {
            console.warn("Failed to draw local video:", e);
          }
        }

        // Vẽ remote video (bên phải)
        if (remoteVideo.videoWidth > 0 && remoteVideo.readyState >= 2) {
          try {
            ctx.drawImage(
              remoteVideo,
              videoWidth + padding * 2,
              padding,
              videoWidth,
              videoHeight
            );
            // Label
            ctx.fillStyle = "#FFFFFF";
            ctx.font = "16px Arial";
            ctx.fillText("Member", videoWidth + padding * 2 + 10, padding + 30);
          } catch (e) {
            console.warn("Failed to draw remote video:", e);
          }
        }
      } else if (localVideo) {
        // Chỉ có local video
        canvas.width = videoWidth + padding * 2;
        canvas.height = videoHeight + padding * 2;
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        if (localVideo.videoWidth > 0 && localVideo.readyState >= 2) {
          ctx.drawImage(localVideo, padding, padding, videoWidth, videoHeight);
          ctx.fillStyle = "#FFFFFF";
          ctx.font = "16px Arial";
          ctx.fillText("Coach", padding + 10, padding + 30);
        }
      } else if (remoteVideo) {
        // Chỉ có remote video
        canvas.width = videoWidth + padding * 2;
        canvas.height = videoHeight + padding * 2;
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        if (remoteVideo.videoWidth > 0 && remoteVideo.readyState >= 2) {
          ctx.drawImage(remoteVideo, padding, padding, videoWidth, videoHeight);
          ctx.fillStyle = "#FFFFFF";
          ctx.font = "16px Arial";
          ctx.fillText("Member", padding + 10, padding + 30);
        }
      }

      return new Promise((resolve) => {
        canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.9);
      });
    } catch (error) {
      console.error("Capture snapshot error:", error);
      return null;
    }
  };

  // Upload snapshot lên Cloudinary
  const uploadSnapshot = async (blob, appointmentId) => {
    if (!blob) return null;

    try {
      const file = new File([blob], `snapshot-${Date.now()}.jpg`, {
        type: "image/jpeg",
      });

      const result = await uploadUnsigned(file, {
        folder: `appointments/${appointmentId}/snapshots`,
      });

      return result.secure_url;
    } catch (error) {
      console.error("Upload snapshot error:", error);
      return null;
    }
  };

  // Chụp và upload snapshot - gửi về backend ngay lập tức
  const takeAndUploadSnapshot = async () => {
    if (!paramId) return null;

    const blob = await captureSnapshot();
    if (!blob) return null;

    try {
      // Upload lên Cloudinary
      const url = await uploadSnapshot(blob, paramId);
      if (!url) return null;

      // Gửi về backend ngay lập tức (real-time sync)
      try {
        await api.saveAppointmentSnapshots(paramId, [url]);
        console.log("Snapshot saved to backend:", url);
      } catch (error) {
        console.error("Save snapshot to backend failed:", error);
        // Backup vào localStorage nếu gửi thất bại
        saveSnapshotToLocalStorage(paramId, url);
      }

      setSnapshots((prev) => [...prev, url]);
      return url;
    } catch (error) {
      console.error("Upload snapshot error:", error);
      return null;
    }
  };

  // Bắt đầu auto snapshots: chụp 3 ảnh tại 5', 10', 15' tính từ START TIME của appointment slot
  const startAutoSnapshots = () => {
    if (hasStartedSnapshotsRef.current) return;
    if (!paramId) return;

    // Lấy appointment data từ location.state hoặc appointmentData state
    const appointment = appointmentData || location.state?.appointment;

    // Nếu không có appointment data, fetch từ API
    if (!appointment) {
      // Fallback: tính từ lúc join (code cũ)
      console.warn("No appointment data, using join time as fallback");
      hasStartedSnapshotsRef.current = true;
      const snapshotTimes = [5 * 60 * 1000, 10 * 60 * 1000, 15 * 60 * 1000];
      const checkRemoteVideo = setInterval(() => {
        const remoteContainer = document.getElementById(REMOTE_MOUNT_ID);
        const videoElement = remoteContainer?.querySelector("video");
        if (
          videoElement &&
          videoElement.videoWidth > 0 &&
          videoElement.readyState >= 2
        ) {
          clearInterval(checkRemoteVideo);
          snapshotTimes.forEach((delay, index) => {
            const timer = setTimeout(async () => {
              console.log(
                `Auto snapshot ${index + 1}/3 at ${
                  delay / 60000
                } minutes from join`
              );
              await takeAndUploadSnapshot();
            }, delay);
            snapshotTimersRef.current.push(timer);
          });
        }
      }, 2000);
      setTimeout(() => clearInterval(checkRemoteVideo), 30000);
      return;
    }

    // Tính thời gian bắt đầu slot từ appointment
    const dateStr = appointment.date || appointment.appointmentDate;
    const timeStr = appointment.startTime || appointment.time;

    if (!dateStr || !timeStr) {
      console.warn(
        "Missing appointment date/time, using join time as fallback"
      );
      // Fallback như trên
      return;
    }

    const slotStartTime = parseLocalDateTime(dateStr, timeStr);
    if (!slotStartTime) {
      console.warn(
        "Invalid appointment start time, using join time as fallback"
      );
      return;
    }

    hasStartedSnapshotsRef.current = true;

    // Snapshot tại 2', 4', 6' tính từ START TIME của slot
    const snapshotOffsets = [
      2 * 60 * 1000, // 2 phút từ startTime
      4 * 60 * 1000, // 4 phút từ startTime
      6 * 60 * 1000, // 6 phút từ startTime
    ];

    // Đợi video ready (local hoặc remote)
    const checkVideo = setInterval(() => {
      const localContainer = document.getElementById("local-mount");
      const remoteContainer = document.getElementById(REMOTE_MOUNT_ID);
      const localVideo = localContainer?.querySelector("video");
      const remoteVideo = remoteContainer?.querySelector("video");

      // Cần ít nhất 1 video
      const hasVideo =
        (localVideo &&
          localVideo.videoWidth > 0 &&
          localVideo.readyState >= 2) ||
        (remoteVideo &&
          remoteVideo.videoWidth > 0 &&
          remoteVideo.readyState >= 2);

      if (hasVideo) {
        clearInterval(checkVideo);

        snapshotOffsets.forEach((offset, index) => {
          const snapshotTime = slotStartTime.getTime() + offset;
          const now = Date.now();
          const delay = snapshotTime - now;

          // Nếu thời gian đã qua rồi, skip
          if (delay < 0) {
            console.log(
              `Snapshot ${index + 1} time already passed (${
                Math.abs(delay) / 60000
              } minutes ago), skipping`
            );
            return;
          }

          const timer = setTimeout(async () => {
            console.log(
              `Auto snapshot ${index + 1}/3 at ${
                offset / 60000
              } minutes from slot start (${new Date(
                snapshotTime
              ).toLocaleTimeString()})`
            );
            await takeAndUploadSnapshot();
          }, delay);

          snapshotTimersRef.current.push(timer);
        });
      }
    }, 2000);

    // Cleanup nếu không có video sau 30s
    setTimeout(() => {
      clearInterval(checkVideo);
    }, 30000);
  };

  // Dừng auto snapshots
  const stopAutoSnapshots = () => {
    snapshotTimersRef.current.forEach((timer) => clearTimeout(timer));
    snapshotTimersRef.current = [];
    hasStartedSnapshotsRef.current = false;
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
        } catch {
          // Ignore stop errors
        }
        try {
          videoTrack.close();
        } catch {
          // Ignore close errors
        }
      }
      if (audioTrack) {
        try {
          await audioTrack.stop();
        } catch {
          // Ignore stop errors
        }
        try {
          audioTrack.close();
        } catch {
          // Ignore close errors
        }
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
      stopAutoSnapshots();
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
        const appId = import.meta.env.VITE_AGORA_APPID || td.appId;
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

        // Lưu appointment data nếu có
        if (location.state?.appointment) {
          setAppointmentData(location.state.appointment);
        }

        // Retry snapshots từ localStorage khi mount
        if (paramId) {
          retryFailedSnapshots(paramId);
        }

        // Bắt đầu auto snapshots sau 5s (đợi video ready)
        setTimeout(() => {
          startAutoSnapshots();
        }, 5000);
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
      stopAutoSnapshots();
      // Don't await cleanup in unmount callback
      cleanupAndLeave();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Xử lý khi user đóng tab/refresh đột ngột
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (snapshots.length > 0 && paramId) {
        // Lưu vào localStorage để retry sau
        const key = `snapshots_${paramId}`;
        const existing = JSON.parse(localStorage.getItem(key) || "[]");
        const existingUrls = existing.map((s) => s.url);

        // Chỉ thêm những URL chưa có trong localStorage
        const newSnapshots = snapshots
          .filter((url) => !existingUrls.includes(url))
          .map((url) => ({ url, timestamp: Date.now() }));

        if (newSnapshots.length > 0) {
          localStorage.setItem(
            key,
            JSON.stringify([...existing, ...newSnapshots])
          );
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [snapshots, paramId]);

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
    stopAutoSnapshots();

    // Gửi lại tất cả snapshots (đảm bảo không mất)
    if (snapshots.length > 0 && paramId) {
      try {
        await api.saveAppointmentSnapshots(paramId, snapshots);
        console.log(
          `Final save: ${snapshots.length} snapshots sent to backend`
        );
      } catch (error) {
        console.error("Final save snapshots error:", error);
        // Backup vào localStorage nếu gửi thất bại
        snapshots.forEach((url) => {
          saveSnapshotToLocalStorage(paramId, url);
        });
      }
    }

    // Retry snapshots từ localStorage
    if (paramId) {
      await retryFailedSnapshots(paramId);
    }

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
