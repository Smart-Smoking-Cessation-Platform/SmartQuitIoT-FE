// src/components/FloatingNotifications.jsx
import React, { useEffect, useRef, useState } from "react";
import bookedNoti from "@/assets/booked_notification.mp3";
import cancelledNoti from "@/assets/Cancelled_Notification.mp3";
import reminderNoti from "@/assets/reminder_notification.mp3";

/**
 * Vibrant FloatingNotifications with sound (limited to 3s)
 * - presence handling removed (DEFAULT used for unknown types)
 * - sounds auto-stop after 3s
 */

const TYPE_STYLE = {
  APPOINTMENT_BOOKED: {
    gradient: "bg-gradient-to-r from-[#34D399] to-[#10B981]",
    glow: "shadow-[0_6px_24px_rgba(16,185,129,0.18)]",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M5 13l4 4L19 7"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  APPOINTMENT_CANCELLED: {
    gradient: "bg-gradient-to-r from-[#FF7A7A] to-[#FF4D4D]",
    glow: "shadow-[0_6px_24px_rgba(255,77,77,0.18)]",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M6 18L18 6M6 6l12 12"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  APPOINTMENT_REMINDER: {
    gradient: "bg-gradient-to-r from-[#FFD166] to-[#FFB020]",
    glow: "shadow-[0_6px_24px_rgba(255,176,32,0.14)]",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 8v5l3 3"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M18.4 6.6A8 8 0 1 0 5.6 19.4"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  DEFAULT: {
    gradient: "bg-gradient-to-r from-[#A78BFA] to-[#7C3AED]",
    glow: "shadow-[0_6px_24px_rgba(124,58,237,0.12)]",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 5v7l4 2"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
};

export default function FloatingNotifications({ max = 3, ttl = 8 }) {
  const [toasts, setToasts] = useState([]);
  const shownRef = useRef(new Set());
  const timersRef = useRef(new Map());

  // audio refs + timers
  const bookedAudioRef = useRef(null);
  const cancelledAudioRef = useRef(null);
  const reminderAudioRef = useRef(null);
  const bookedAudioTimerRef = useRef(null);
  const cancelledAudioTimerRef = useRef(null);
  const reminderAudioTimerRef = useRef(null);

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [audioReady, setAudioReady] = useState(false);

  // Initialize audio with better error handling
  useEffect(() => {
    let mounted = true;

    const initAudio = () => {
      try {
        // Create audio elements with error handling
        const createAudio = (src, name) => {
          try {
            if (!src) {
              console.error(`[Audio] No source provided for ${name}`);
              return null;
            }

            // Imported audio files are already URLs, use directly
            const audio = new Audio(src);
            audio.volume = 0.65;
            audio.loop = false;
            audio.preload = "auto";
            
            // Handle audio errors
            audio.addEventListener("error", (e) => {
              console.error(`[Audio] Failed to load ${name}:`, src, e, audio.error);
            });
            
            // Handle audio canplay event
            audio.addEventListener("canplaythrough", () => {
              if (mounted) {
                console.debug(`[Audio] ${name} ready to play`);
                setAudioReady(true);
              }
            }, { once: true });

            // Try to load audio
            try {
              audio.load();
            } catch (loadErr) {
              console.warn(`[Audio] Load error for ${name} (may be normal):`, loadErr);
            }

            console.debug(`[Audio] Created audio element for ${name}:`, src);
            return audio;
          } catch (e) {
            console.error(`[Audio] Error creating audio for ${name}:`, e);
            return null;
          }
        };

        bookedAudioRef.current = createAudio(bookedNoti, "booked");
        cancelledAudioRef.current = createAudio(cancelledNoti, "cancelled");
        reminderAudioRef.current = createAudio(reminderNoti, "reminder");

        // Verify audio elements were created
        if (!bookedAudioRef.current) {
          console.error("[Audio] Failed to create booked notification audio");
        } else {
          console.debug("[Audio] Booked audio created successfully");
        }
        if (!cancelledAudioRef.current) {
          console.error("[Audio] Failed to create cancelled notification audio");
        } else {
          console.debug("[Audio] Cancelled audio created successfully");
        }
        if (!reminderAudioRef.current) {
          console.error("[Audio] Failed to create reminder notification audio");
        } else {
          console.debug("[Audio] Reminder audio created successfully");
        }
      } catch (e) {
        console.error("[Audio] Initialization error:", e);
      }
    };

    initAudio();

    return () => {
      mounted = false;
      try {
        bookedAudioRef.current?.pause();
        cancelledAudioRef.current?.pause();
        reminderAudioRef.current?.pause();
        bookedAudioRef.current = null;
        cancelledAudioRef.current = null;
        reminderAudioRef.current = null;
      } catch (e) {}
      clearTimeout(bookedAudioTimerRef.current);
      clearTimeout(cancelledAudioTimerRef.current);
      clearTimeout(reminderAudioTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const makeId = (payload) =>
      payload?.id ??
      payload?.deepLink ??
      `${payload?.notificationType ?? "notif"}_${
        payload?.title ?? "t"
      }_${Date.now()}`;

    const normalize = (p) => {
      if (!p) return null;
      const notificationType = p.notificationType ?? p.type ?? "DEFAULT";
      return {
        id: makeId(p),
        title: p.title || "Notification",
        content: p.content || "",
        url: p.url,
        deepLink: p.deepLink,
        notificationType,
      };
    };

    const stopAudio = (audioRef, timerRef) => {
      try {
        if (audioRef?.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
      } catch (e) {}
      if (timerRef?.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };

    const playWithLimit = async (audioRef, timerRef, maxMs = 3000) => {
      if (!soundEnabled) {
        console.debug("[Audio] Sound disabled, skipping playback");
        return;
      }
      if (!audioRef?.current) {
        console.warn("[Audio] Audio ref not available");
        return;
      }

      const audio = audioRef.current;

      try {
        // Reset audio to start
        if (audio.currentTime > 0) {
          audio.currentTime = 0;
        }
        
        // Ensure audio is loaded before playing
        if (audio.readyState === 0) {
          // HAVE_NOTHING - need to load
          try {
            audio.load();
            // Wait for audio to be ready (with timeout)
            await new Promise((resolve, reject) => {
              const timeout = setTimeout(() => {
                reject(new Error("Audio load timeout"));
              }, 2000);
              
              const checkReady = () => {
                if (audio.readyState >= 2) {
                  clearTimeout(timeout);
                  audio.removeEventListener("canplaythrough", checkReady);
                  audio.removeEventListener("error", onError);
                  resolve();
                }
              };
              
              const onError = () => {
                clearTimeout(timeout);
                audio.removeEventListener("canplaythrough", checkReady);
                audio.removeEventListener("error", onError);
                reject(new Error("Audio load error"));
              };
              
              audio.addEventListener("canplaythrough", checkReady, { once: true });
              audio.addEventListener("error", onError, { once: true });
            });
          } catch (loadErr) {
            console.warn("[Audio] Load failed or timeout:", loadErr);
            // Try to play anyway, might work
          }
        }

        // Play audio
        const playPromise = audio.play();
        if (playPromise && typeof playPromise.then === "function") {
          await playPromise;
          console.debug("[Audio] Playing sound successfully");
        } else {
          console.debug("[Audio] Play called (no promise returned)");
        }

        // Set timer to stop audio after maxMs
        if (timerRef?.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          stopAudio(audioRef, timerRef);
        }, maxMs);
      } catch (err) {
        // Handle autoplay policy errors
        if (err.name === "NotAllowedError" || err.name === "NotSupportedError") {
          console.warn(
            "[Audio] Playback blocked by browser. User interaction may be required.",
            err
          );
        } else {
          console.warn("[Audio] Play failed:", err);
        }
      }
    };

    const show = (raw) => {
      console.debug("[Notification] Received notification event:", raw);
      const payload = normalize(raw);
      if (!payload) {
        console.warn("[Notification] Failed to normalize payload:", raw);
        return;
      }
      
      // Check if already shown (with better ID matching)
      if (shownRef.current.has(payload.id)) {
        console.debug("[Notification] Duplicate notification ignored:", payload.id);
        return;
      }
      shownRef.current.add(payload.id);

      console.debug("[Notification] Showing notification:", payload);
      setToasts((prev) => [payload, ...prev].slice(0, max));

      // Play sound based on notification type
      if (payload.notificationType === "APPOINTMENT_BOOKED") {
        playWithLimit(bookedAudioRef, bookedAudioTimerRef, 3000);
      } else if (payload.notificationType === "APPOINTMENT_CANCELLED") {
        playWithLimit(cancelledAudioRef, cancelledAudioTimerRef, 3000);
      } else if (payload.notificationType === "APPOINTMENT_REMINDER") {
        playWithLimit(reminderAudioRef, reminderAudioTimerRef, 3000);
      }

      const timer = setTimeout(() => removeById(payload.id), ttl * 1000);
      timersRef.current.set(payload.id, timer);
    };

    const handler = (e) => {
      if (!e || !e.detail) {
        console.warn("[Notification] Invalid event:", e);
        return;
      }
      show(e.detail);
    };

    window.addEventListener("ws:notification", handler);

    return () => {
      window.removeEventListener("ws:notification", handler);
      for (const t of timersRef.current.values()) clearTimeout(t);
      timersRef.current.clear();
      shownRef.current.clear();
      stopAudio(bookedAudioRef, bookedAudioTimerRef);
      stopAudio(cancelledAudioRef, cancelledAudioTimerRef);
      stopAudio(reminderAudioRef, reminderAudioTimerRef);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [max, ttl, soundEnabled]);

  const removeById = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
    shownRef.current.delete(id);
  };

  return (
    <>
      <style>{`
        @keyframes notifEnter {
          0% { transform: translateY(-10px) scale(.98); opacity: 0; filter: blur(2px); }
          60% { transform: translateY(4px) scale(1.02); opacity: 1; filter: blur(0); }
          100% { transform: translateY(0) scale(1); }
        }
        @keyframes progress { from { width: 100%; } to { width: 0%; } }
      `}</style>

      <div
        style={{
          position: "fixed",
          right: 16,
          top: 16,
          zIndex: 99999,
          width: "100%",
          maxWidth: 420,
          pointerEvents: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: 8,
          }}
        >
          <button
            aria-pressed={!soundEnabled}
            onClick={() => setSoundEnabled((s) => !s)}
            title={
              soundEnabled
                ? "Mute notification sounds"
                : "Unmute notification sounds"
            }
            style={{
              background: soundEnabled
                ? "linear-gradient(90deg,#10B981,#34D399)"
                : "transparent",
              color: soundEnabled ? "white" : "#374151",
              border: "1px solid rgba(0,0,0,0.06)",
              padding: "6px 8px",
              borderRadius: 8,
              cursor: "pointer",
              boxShadow: soundEnabled
                ? "0 6px 18px rgba(16,185,129,0.18)"
                : "none",
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            {soundEnabled ? "🔊On" : "🔈Off"}
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {toasts.map((t) => {
            const cfg = TYPE_STYLE[t.notificationType] || TYPE_STYLE.DEFAULT;
            return (
              <div
                key={t.id}
                className={cfg.glow}
                style={{
                  display: "flex",
                  width: "100%",
                  borderRadius: 12,
                  overflow: "hidden",
                  animation: "notifEnter 360ms cubic-bezier(.2,.9,.3,1)",
                  boxShadow: "0 10px 30px rgba(2,6,23,0.08)",
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(255,255,255,0.92))",
                  border: "1px solid rgba(255,255,255,0.6)",
                  backdropFilter: "blur(6px)",
                  alignItems: "stretch",
                }}
                role="status"
                aria-live="polite"
              >
                <div
                  className={`flex items-center justify-center px-3 ${cfg.gradient}`}
                  style={{ minWidth: 56 }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {cfg.icon}
                  </div>
                </div>

                <div style={{ flex: 1, padding: "12px 12px 12px 10px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 8,
                      alignItems: "flex-start",
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 700,
                          color: "#0f172a",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {t.title}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "#475569",
                          marginTop: 6,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {t.content}
                      </div>
                    </div>

                    <button
                      onClick={() => removeById(t.id)}
                      aria-label="Close notification"
                      style={{
                        background: "transparent",
                        border: "none",
                        fontSize: 18,
                        color: "#64748b",
                        cursor: "pointer",
                      }}
                    >
                      ×
                    </button>
                  </div>

                  <div
                    style={{
                      marginTop: 10,
                      height: 6,
                      borderRadius: 6,
                      overflow: "hidden",
                      background: "rgba(15,23,42,0.05)",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        animation: `progress ${ttl}s linear forwards`,
                      }}
                      className={`${cfg.gradient}`}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
