import api from "../api";

const api = axios.create({
  baseURL: "/api",
});

// Interceptor para agregar el token en cada request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;