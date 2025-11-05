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
  async (err) => {
    const originalRequest = err.config;
    if (err.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        return Promise.reject(err);
      }

      try {
        const response = await instance.post(`/auth/refresh`, {
          refreshToken: refreshToken,
        });

        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);

        originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;

        return instance(originalRequest);
      } catch (error) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        console.log("err", err);

        return Promise.reject(err);
      }
    }
    return Promise.reject(err);
  }
);

export default instance;
