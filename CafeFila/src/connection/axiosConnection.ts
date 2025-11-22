import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

const API_BASE_URL = "http://localhost:8000/api";
const TIMEOUT_MS = 15000;
const TOKEN_STORAGE_KEY = "jwt_token";
const USER_STORAGE_KEY = "usuario";

function isTokenExpired(token: any): boolean {
  try {
    const payloadBase64 = token.split(".")[1];
    const payload = JSON.parse(atob(payloadBase64));
    const expirationTimeMs = payload.exp * 1000;
    return Date.now() >= expirationTimeMs;
  } catch (e) {
    console.error("Erro ao decodificar token:", e);
    return true;
  }
}

function handleExpiredSession(message: string) {
  console.warn(message);
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
  window.location.href = "/login";
}

export const connection = axios.create({
  baseURL: API_BASE_URL,
  timeout: TIMEOUT_MS,
  headers: {
    "Content-Type": "application/json",
  },
});

connection.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);

    if (token && token.startsWith("ey")) {
      if (isTokenExpired(token)) {
        handleExpiredSession("Sessão expirada. Faça login novamente.");
        return Promise.reject(new Error("Sessão expirada. Faça login novamente."));
      }
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

connection.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response ? error.response.status : null;
    const originalRequestUrl = error.config?.url;

    // LÓGICA CORRIGIDA: Não redireciona se o erro 401 vier da própria página de login
    if (status === 401 && originalRequestUrl !== "/usuarios/login") {
      handleExpiredSession("Autorização negada (401). Faça login novamente.");
    }

    return Promise.reject(error);
  }
);
