import axios from "axios";
import { API_BASE_URL } from "./apiBase";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Separate auth API (admin users microservice)
const AUTH_LOCAL_BASE = 'http://localhost:5502/api'
const AUTH_PROD_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://projeto-integrador-3-back.vercel.app/api'
const AUTH_API_BASE = process.env.AUTH_API_URL || (process.env.NODE_ENV === 'production' ? AUTH_PROD_BASE : AUTH_LOCAL_BASE)

const authApi = axios.create({
  baseURL: AUTH_API_BASE,
  withCredentials: true,
});

export { authApi };

export default api;