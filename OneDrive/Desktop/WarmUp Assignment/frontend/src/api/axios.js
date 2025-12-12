import axios from "axios";
import store from "../store";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  timeout: 15000
});

api.interceptors.request.use((config) => {
  try {
    const state = store.getState ? store.getState() : store;
    const token = state?.auth?.token;
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    // ignore
  }
  return config;
}, (err) => Promise.reject(err));

export default api;
