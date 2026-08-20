import axios from "axios";

// Environment Variable undhi ante adhi tiskuntundi, lekapothe Railway URL target chestundi
const API_URL = import.meta.env.VITE_API_URL || "https://harihire-production.up.railway.app";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;