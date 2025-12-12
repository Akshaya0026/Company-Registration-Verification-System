// frontend/src/api.js
import axios from "axios";
import toast from "react-hot-toast";

const BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000/api";

const api = axios.create({
  baseURL: BASE,
  headers: { "Content-Type": "application/json" },
});

// attach token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (err) => Promise.reject(err)
);

// handle responses globally (401 -> redirect to login)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    if (status === 401) {
      // unauthorized -> clear token and redirect to login
      localStorage.removeItem("token");
      toast.error("Session expired — please login again.");
      // use assign to navigate (works in tests & SPA)
      window.location.assign("/login");
    } else {
      const msg = err?.response?.data?.message || err.message || "Request failed";
      toast.error(msg);
    }
    return Promise.reject(err);
  }
);

export default api;

/**
 * uploadCompany helper for multipart/form-data using the same axios instance
 * method: "post" or "put", id optional for PUT /companies/:id
 */
export async function uploadCompany(formData, method = "post", id = null) {
  const url = id ? `/companies/${id}` : "/companies";
  // axios instance will attach token automatically; set content-type for multipart
  return api.request({
    url,
    method: method.toLowerCase(),
    data: formData,
    headers: { "Content-Type": "multipart/form-data" },
  });
}
