import { jwtDecode } from "jwt-decode";
import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_URL_API}/auth/system`;

const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/refresh`, {
      refreshToken,
    });
    const { accessToken, refreshToken: newRefreshToken } = response.data;

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", newRefreshToken);
    return accessToken;
  } catch (err) {
    console.error("Refresh token failed:", err);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    return null;
  }
};

export const isAuthenticated = async () => {
  let token = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  if (!token) return false;

  try {
    const { exp } = jwtDecode(token);

    // Token còn sống
    if (Date.now() < exp * 1000) return true;

    // Token hết hạn → thử refresh
    if (refreshToken) {
      const newToken = await refreshAccessToken(refreshToken);
      return !!newToken;
    }

    // Không có refresh token → logout
    localStorage.removeItem("accessToken");
    return false;
  } catch (err) {
    return false;
  }
};

export const isAuthenticatedRole = async (role) => {
  const ok = await isAuthenticated();
  if (!ok) return false;

  const token = localStorage.getItem("accessToken");
  const payload = jwtDecode(token);
  return payload?.scope === role;
};
