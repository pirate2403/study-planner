import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',
  headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' },
});
