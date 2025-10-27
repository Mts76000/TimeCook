import axios from "axios";

const envUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";
// Éviter le Mixed Content: si la page est en HTTPS, forcer l'API en HTTPS
let baseURL = envUrl;
if (
  typeof window !== "undefined" &&
  window.location.protocol === "https:" &&
  envUrl.startsWith("http://")
) {
  baseURL = envUrl.replace("http://", "https://");
}

export const api = axios.create({ baseURL });

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("token", token);
  } else {
    delete api.defaults.headers.common["Authorization"];
    localStorage.removeItem("token");
  }
}

// Load token on startup
const saved = localStorage.getItem("token");
if (saved) setAuthToken(saved);
