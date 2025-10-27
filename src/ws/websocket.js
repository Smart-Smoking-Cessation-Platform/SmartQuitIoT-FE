// src/ws/websocket.js
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const WS_BASE = "http://localhost:8080/api/ws"; // hoặc domain backend của bạn

let stompClient = null;
let connected = false;

/**
 * Kết nối WebSocket qua SockJS & STOMP
 */
export function connectWebSocket(onMessage, memberId) {
  if (connected) return;

  stompClient = new Client({
    webSocketFactory: () => new SockJS(WS_BASE),
    reconnectDelay: 3000,
    debug: (str) => console.log("[STOMP]", str),
    onConnect: () => {
      connected = true;
      console.log("✅ Connected to WebSocket");

      // Subcribe tới topic theo memberId (bạn gửi từ BE)
      const topic = `/topic/notifications/${memberId}`;
      stompClient.subscribe(topic, (msg) => {
        console.log("📩 Message received:", msg.body);
        if (onMessage) onMessage(JSON.parse(msg.body));
      });
    },
    onDisconnect: () => {
      connected = false;
      console.log("🔴 Disconnected");
    },
    onStompError: (frame) => {
      console.error("STOMP error", frame.headers["message"], frame.body);
    },
  });

  stompClient.activate();
}

/**
 * Ngắt kết nối
 */
export function disconnectWebSocket() {
  if (stompClient) {
    stompClient.deactivate();
    connected = false;
  }
}
