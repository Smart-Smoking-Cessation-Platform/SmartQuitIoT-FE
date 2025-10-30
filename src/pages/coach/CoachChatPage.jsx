// src/pages/coach/CoachChatPage.jsx
import React, { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import styles from "../../styles/CoachChatPage.module.css";

/**
 * CoachChatPage (socket optional)
 * - dynamic import('socket.io-client') => avoids vite import error if package missing
 * - fallback (no-socket) mode so UI still usable
 *
 * To enable real socket: run `npm i socket.io-client` (or pnpm/yarn)
 * and set REACT_APP_SOCKET_URL (or edit SOCKET_URL below)
 */

// CONFIG: set socket URL through env or edit here
// const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "/";

const MOCK_USER = {
  id: 9999,
  name: "Bạn (Coach)",
};

const initialConversations = [
  { id: "c-1", name: "Nguyễn Văn A", lastMessage: "Ok, hẹn 10h" },
  { id: "c-2", name: "Trần Thị B", lastMessage: "Cần đổi lịch" },
  { id: "c-3", name: "Phạm C", lastMessage: "Cám ơn coach" },
];

const makeMockMessages = (convId) => [
  {
    id: `${convId}-m1`,
    from: "member",
    text: "Xin chào coach!",
    createdAt: Date.now() - 1000 * 60 * 60,
  },
  {
    id: `${convId}-m2`,
    from: "coach",
    text: "Chào bạn, nói đi",
    createdAt: Date.now() - 1000 * 60 * 50,
  },
];

export default function CoachChatPage() {
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedConvId, setSelectedConvId] = useState(
    initialConversations[0].id
  );
  const [messages, setMessages] = useState(() => {
    const map = {};
    initialConversations.forEach((c) => (map[c.id] = makeMockMessages(c.id)));
    return map;
  });
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("init"); // init | connecting | connected | nosocket
  const [typingMap, setTypingMap] = useState({});
  const socketRef = useRef(null);
  const listRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // init socket dynamically
  useEffect(() => {
    let mounted = true;
    let socket = null;

    const initSocket = async () => {
      setStatus("connecting");
      try {
        // dynamic import avoids vite static resolution error when package absent
        const mod = await import("socket.io-client");
        const io = mod.io || mod.default; // compatibility
        socket = io(SOCKET_URL, {
          transports: ["websocket"],
          autoConnect: true,
        });
        socketRef.current = socket;

        socket.on("connect", () => {
          if (!mounted) return;
          setStatus("connected");
        });
        socket.on("disconnect", () => {
          if (!mounted) return;
          setStatus("init");
        });

        // generic message event
        socket.on("message", (payload) => {
          if (!mounted || !payload || !payload.conversationId) return;
          setMessages((prev) => {
            const copy = { ...prev };
            copy[payload.conversationId] = [
              ...(copy[payload.conversationId] || []),
              payload,
            ];
            return copy;
          });
          setConversations((prev) =>
            prev.map((c) =>
              c.id === payload.conversationId
                ? { ...c, lastMessage: payload.text }
                : c
            )
          );
        });

        // typing
        socket.on("typing", ({ conversationId, from, isTyping }) => {
          if (!mounted) return;
          setTypingMap((prev) => ({
            ...prev,
            [conversationId]: isTyping ? from : null,
          }));
        });

        // optional: join initial room
        socket.emit &&
          socket.emit("join", {
            conversationId: selectedConvId,
            userId: MOCK_USER.id,
          });

        // mark socket connected
        setStatus("connected");
      } catch (err) {
        // socket.io-client not installed or dynamic import failed
        console.warn(
          "socket.io-client not available — running in no-socket mode.",
          err
        );
        setStatus("nosocket");
        socketRef.current = null;
      }
    };

    initSocket();

    return () => {
      mounted = false;
      try {
        if (socketRef.current) {
          socketRef.current.emit &&
            socketRef.current.emit("leave", {
              conversationId: selectedConvId,
              userId: MOCK_USER.id,
            });
          socketRef.current.disconnect && socketRef.current.disconnect();
        }
      } catch (e) {
        // ignore
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // when switching conversation: inform server (if available)
  useEffect(() => {
    const socket = socketRef.current;
    if (socket && socket.connected) {
      socket.emit("join", {
        conversationId: selectedConvId,
        userId: MOCK_USER.id,
      });
      // optionally request history
    }
    // cleanup: leave on change
    return () => {
      const s = socketRef.current;
      if (s && s.connected) {
        s.emit("leave", {
          conversationId: selectedConvId,
          userId: MOCK_USER.id,
        });
      }
    };
  }, [selectedConvId]);

  // auto scroll
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    setTimeout(() => (el.scrollTop = el.scrollHeight), 50);
  }, [messages, selectedConvId]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    const convId = selectedConvId;
    const tempId = `tmp-${Date.now()}`;

    const msg = {
      id: tempId,
      conversationId: convId,
      from: "coach",
      text,
      createdAt: Date.now(),
      pending: true,
    };
    setMessages((prev) => {
      const copy = { ...prev };
      copy[convId] = [...(copy[convId] || []), msg];
      return copy;
    });
    setInput("");

    const socket = socketRef.current;
    if (socket && socket.connected) {
      // send and expect ack callback from server
      socket.emit(
        "send_message",
        { conversationId: convId, from: MOCK_USER.id, text },
        (ack) => {
          if (ack && ack.ok && ack.message) {
            setMessages((prev) => {
              const copy = { ...prev };
              copy[convId] = (copy[convId] || []).map((m) =>
                m.id === tempId ? ack.message : m
              );
              return copy;
            });
          } else {
            // mark failed
            setMessages((prev) => {
              const copy = { ...prev };
              copy[convId] = (copy[convId] || []).map((m) =>
                m.id === tempId ? { ...m, pending: false, failed: true } : m
              );
              return copy;
            });
          }
        }
      );
      return;
    }

    // fallback: no socket -> simulate server ack after short delay
    setTimeout(() => {
      const serverMsg = {
        id: `s-${Date.now()}`,
        conversationId: convId,
        from: "coach",
        text,
        createdAt: Date.now(),
      };
      setMessages((prev) => {
        const copy = { ...prev };
        copy[convId] = (copy[convId] || []).map((m) =>
          m.id === tempId ? serverMsg : m
        );
        return copy;
      });
      setConversations((prev) =>
        prev.map((c) => (c.id === convId ? { ...c, lastMessage: text } : c))
      );
    }, 300);
  };

  const handleInputChange = (v) => {
    setInput(v);
    const socket = socketRef.current;
    if (!socket || !socket.connected) return;
    socket.emit("typing", {
      conversationId: selectedConvId,
      from: MOCK_USER.id,
      isTyping: true,
    });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing", {
        conversationId: selectedConvId,
        from: MOCK_USER.id,
        isTyping: false,
      });
    }, 700);
  };

  const convMessages = messages[selectedConvId] || [];
  const typingWho = typingMap[selectedConvId];

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h3>Conversations</h3>
          <span
            className={`${styles.badge} ${
              status === "connected" ? styles.badgeOnline : styles.badgeOffline
            }`}
          >
            {status === "connected"
              ? "Online"
              : status === "connecting"
              ? "Connecting..."
              : "No Socket"}
          </span>
        </div>

        <ul className={styles.convList}>
          {conversations.map((c) => (
            <li
              key={c.id}
              role="button"
              tabIndex={0}
              onClick={() => setSelectedConvId(c.id)}
              className={`${styles.convItem} ${
                selectedConvId === c.id ? styles.convItemActive : ""
              }`}
            >
              <div className={styles.convTitle}>{c.name}</div>
              <div className={styles.convMeta}>{c.lastMessage}</div>
            </li>
          ))}
        </ul>
      </aside>

      <section className={styles.chatPanel}>
        <header className={styles.chatHeader}>
          <div>
            <div className={styles.chatTitle}>
              {conversations.find((c) => c.id === selectedConvId)?.name ||
                "Chat"}
            </div>
            <div className={styles.chatSub}>
              {conversations.find((c) => c.id === selectedConvId)?.lastMessage}
            </div>
          </div>
          <div className={styles.convId}>ID: {selectedConvId}</div>
        </header>

        <div ref={listRef} className={styles.messageList}>
          {convMessages.map((m) => {
            const mine =
              m.from === "coach" ||
              m.from === MOCK_USER.id ||
              m.from === MOCK_USER.name;
            return (
              <div
                key={m.id}
                className={`${styles.msgRow} ${
                  mine ? styles.msgRowEnd : styles.msgRowStart
                }`}
              >
                <div
                  className={`${styles.msgBubble} ${
                    mine ? styles.msgMine : styles.msgOther
                  }`}
                >
                  <div className={styles.msgText}>{m.text}</div>
                  <div className={styles.msgMeta}>
                    <span className={styles.msgTime}>
                      {new Date(m.createdAt).toLocaleTimeString()}
                    </span>
                    {m.pending && (
                      <span className={styles.msgPending}>Sending…</span>
                    )}
                    {m.failed && (
                      <span className={styles.msgFailed}>Failed</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {typingWho && (
            <div className={styles.typing}>
              {typingWho === MOCK_USER.id
                ? "Bạn đang gõ..."
                : `${typingWho} đang gõ…`}
            </div>
          )}
        </div>

        <div className={styles.inputBar}>
          <input
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Gõ tin nhắn..."
            className={styles.input}
            aria-label="Message"
          />
          <button
            onClick={handleSend}
            className={styles.sendBtn}
            aria-label="Send"
          >
            <Send className="w-4 h-4" />
            <span className={styles.sendLabel}>Send</span>
          </button>
        </div>
      </section>
    </div>
  );
}
