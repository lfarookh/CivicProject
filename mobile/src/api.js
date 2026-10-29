import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE = (process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080').replace(/\/$/, '');
const TOKEN_KEY = 'civicnet.token';

let token = null;
let onUnauthorized = () => {};

export const setUnauthorizedHandler = (fn) => { onUnauthorized = fn; };
export const loadToken = async () => (token = await AsyncStorage.getItem(TOKEN_KEY));
export const saveToken = async (t) => {
  token = t;
  if (t) await AsyncStorage.setItem(TOKEN_KEY, t); else await AsyncStorage.removeItem(TOKEN_KEY);
};

async function request(path, { method = 'GET', body } = {}) {
  let res;
  try {
    res = await fetch(BASE + path, {
      method,
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error('Can’t reach the server. Check your connection and try again.');
  }
  if (res.status === 401 && token) { onUnauthorized(); throw new Error('Your session has expired. Sign in again.'); }
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || `Request failed (${res.status})`);
  return data;
}

export const api = {
  login: (email, password) => request('/api/auth/login', { method: 'POST', body: { email, password } }),
  register: (payload) => request('/api/auth/register', { method: 'POST', body: payload }),
  me: () => request('/api/me'),
  feed: (page, type) => request(`/api/feed?page=${page}&size=20${type ? `&type=${type}` : ''}`),
  post: (content) => request('/api/posts', { method: 'POST', body: { content } }),
  like: (id) => request(`/api/posts/${id}/like`, { method: 'POST' }),
};
