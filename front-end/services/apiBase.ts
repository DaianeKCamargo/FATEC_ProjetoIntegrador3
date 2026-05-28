const DEFAULT_BACKEND_BASE_URL = 'https://projeto-integrador-3-back.vercel.app/api'

export const API_BASE_URL = (
    process.env.API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    DEFAULT_BACKEND_BASE_URL
).replace(/\/$/, '')
