const LOCAL_BACKEND_BASE_URL = 'http://localhost:5500/api'
const PRODUCTION_BACKEND_BASE_URL = 'https://projeto-integrador-3-back.vercel.app/api'

const isProduction = process.env.NODE_ENV === 'production'

export const API_BASE_URL = (
    process.env.API_BASE_URL ||
    (isProduction ? process.env.NEXT_PUBLIC_API_URL : LOCAL_BACKEND_BASE_URL) ||
    PRODUCTION_BACKEND_BASE_URL
).replace(/\/$/, '')
