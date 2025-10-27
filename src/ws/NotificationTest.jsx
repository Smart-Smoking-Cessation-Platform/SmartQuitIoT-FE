// src/components/NotificationTest.js
import React, { useEffect, useState } from "react";
import { connectWebSocket, disconnectWebSocket } from "../ws/websocket";

export default function NotificationTest() {
  const [notifications, setNotifications] = useState([]);
  const memberId = 1; // ⚠️ Đổi thành ID thật của bạn

  useEffect(() => {
    connectWebSocket((msg) => {
      setNotifications((prev) => [msg, ...prev]);
    }, memberId);

    return () => disconnectWebSocket();
  }, [memberId]);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>🔔 Test WebSocket Notifications</h2>
      {notifications.length === 0 && <p>Chưa có thông báo nào...</p>}
      {notifications.map((n) => (
        <div
          key={n.id}
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <h4>
            {n.icon && (
              <img
                src={n.icon}
                alt=""
                width="24"
                height="24"
                style={{ verticalAlign: "middle", marginRight: "6px" }}
              />
            )}
            {n.title}
          </h4>
          <p>{n.content}</p>
          <small>
            {n.createdAt
              ? new Date(n.createdAt).toLocaleString()
              : "Không rõ thời gian"}
          </small>
          {n.url && (
            <div>
              <a href={n.url} target="_blank" rel="noreferrer">
                🔗 Xem chi tiết
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
