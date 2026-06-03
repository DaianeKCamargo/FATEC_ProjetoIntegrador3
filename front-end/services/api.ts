import axios from "axios";
import { API_BASE_URL } from "./apiBase";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

const AUTH_API_BASE = (
  process.env.NEXT_PUBLIC_AUTH_API_URL ||
  API_BASE_URL
).replace(/\/$/, '')

const authApi = axios.create({
  baseURL: AUTH_API_BASE,
  withCredentials: true,
});

authApi.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const sessionToken = localStorage.getItem('adminSessionToken')

    if (sessionToken) {
      config.headers.Authorization = `Bearer ${sessionToken}`
    }
  }

  return config
})

export { authApi };

export default api;
