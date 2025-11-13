// src/context/WebsocketProvider.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { createStompClient } from "@/lib/stompClient";
import useAuth from "@/hooks/useAuth";

const WebsocketContext = createContext(null);
export function useWebsocket() {
  return useContext(WebsocketContext);
}

export default function WebsocketProvider({
  children,
  wsPath = "/ws",
  autoConnect = true,
}) {
  const clientRef = useRef(null);
  const [connected, setConnected] = useState(false);

  // prefer hook if exists
  const auth = useAuth?.() ?? {
    getToken: () => localStorage.getItem("accessToken"),
    getAccountId: () => {
      try {
        const a = localStorage.getItem("account");
        return a ? JSON.parse(a).id : null;
      } catch {
        return null;
      }
    },
  };

  // stable tokenProvider compatible with createStompClient
  const tokenProvider = async () =>
    auth.getToken?.() ?? localStorage.getItem("accessToken");

  useEffect(() => {
    if (!autoConnect) return;

    const rawEnv = import.meta.env.VITE_WS_URL;
    const fallback = (() => {
      const proto = window.location.protocol === "https:" ? "wss:" : "ws:";
      return `${proto}//${window.location.host}${wsPath}`;
    })();

    const wsRaw =
      rawEnv ||
      (import.meta.env.VITE_API_BASE
        ? `${import.meta.env.VITE_API_BASE}/ws`
        : fallback);
    console.debug("[WS] provider init. raw env:", rawEnv, " -> wsRaw:", wsRaw);

    let mounted = true;
    (async () => {
      try {
        const client = await createStompClient({
          wsUrl: wsRaw,
          tokenProvider,
          debug: false,
          onConnect: (frame, cl) => {
            if (!mounted) return;
            console.debug("[WS] onConnect frame", frame?.headers);
            setConnected(true);

            const accountId =
              auth.getAccountId?.() ??
              (() => {
                try {
                  const a = localStorage.getItem("account");
                  return a ? JSON.parse(a).id : null;
                } catch {
                  return null;
                }
              })();
            if (accountId) {
              const topic = `/topic/notifications/${accountId}`;
              try {
                cl.subscribe(topic, (m) => {
                  if (!m.body) return;
                  try {
                    const payload = JSON.parse(m.body);
                    window.dispatchEvent(
                      new CustomEvent("ws:notification", { detail: payload })
                    );
                    console.debug("[WS] received notification", payload);
                  } catch (e) {
                    console.warn("[WS] invalid notification payload", e);
                  }
                });
                console.debug("[WS] subscribed to", topic);
              } catch (e) {
                console.warn("[WS] subscribe notifications failed", e);
              }
            } else {
              console.debug(
                "[WS] accountId missing - skipping /topic/notifications subscribe"
              );
            }

            // presence
            try {
              cl.subscribe("/topic/presence/coach", (m) => {
                if (!m.body) return;
                try {
                  const p = JSON.parse(m.body);
                  window.dispatchEvent(
                    new CustomEvent("ws:presence", { detail: p })
                  );
                } catch (e) {}
              });
            } catch (e) {
              console.warn("[WS] subscribe presence failed", e);
            }
          },
          onStompError: (frame) => {
            console.error("[WS] broker error", frame);
          },
        });

        clientRef.current = client;
      } catch (e) {
        console.error("[WS] init failed", e);
        setConnected(false);
      }
    })();

    return () => {
      mounted = false;
      (async () => {
        try {
          if (clientRef.current) {
            await clientRef.current.deactivate?.();
          }
        } catch (e) {}
        clientRef.current = null;
        setConnected(false);
      })();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = {
    client: clientRef.current,
    connected,
    subscribe: (dest, cb) => clientRef.current?.subscribe(dest, cb),
    publish: (dest, headers = {}, body = "") => {
      if (!clientRef.current || !clientRef.current.connected) return;
      clientRef.current.publish({ destination: dest, headers, body });
    },
  };

  return (
    <WebsocketContext.Provider value={value}>
      {children}
    </WebsocketContext.Provider>
  );
}
