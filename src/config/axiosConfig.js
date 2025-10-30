// src/config/axiosConfig.js
import axios from "axios";

const raw = import.meta.env.VITE_URL_API || "http://localhost:8080/api";
const baseURL = String(raw).replace(/\/+$/, ""); // remove trailing slash

const instance = axios.create({
  baseURL, // e.g. http://localhost:8080/api
  headers: { "Content-Type": "application/json" },
});

instance.interceptors.request.use(
  (config) => {
    const accessToken =
      localStorage.getItem("accessToken") ||
      localStorage.getItem("access_token");
    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response && err.response.status === 401) {
      console.error("Unauthorized access - redirect to login (or handle it)");
      // optionally: window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default instance;
