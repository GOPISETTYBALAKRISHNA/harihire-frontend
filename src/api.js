import axios from "axios";

// Railway Absolute Backend URL
const BASE_URL = "https://harihire-production.up.railway.app";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    // Force absolute target URL to prevent Vercel domain prepending
    if (config.url && !config.url.startsWith("http")) {
      const cleanPath = config.url.startsWith("/") ? config.url : `/${config.url}`;
      config.url = `${BASE_URL}${cleanPath}`;
    }

    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;