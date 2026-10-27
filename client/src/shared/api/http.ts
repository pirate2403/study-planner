import axios from 'axios';

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' },
});
