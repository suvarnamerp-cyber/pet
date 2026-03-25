import type { AuthSession } from "./types";

const COOKIE_USER = "pettag_user";
const COOKIE_TOKEN = "pettag_token";
const MAX_AGE = 60 * 60 * 24 * 7;

function readCookie(name: string) {
  if (typeof document === "undefined") return "";
  const cookie = document.cookie
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${name}=`));
  return cookie ? decodeURIComponent(cookie.split("=")[1]) : "";
}

function writeCookie(name: string, value: string, maxAge = MAX_AGE) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function setSession(session: AuthSession) {
  writeCookie(COOKIE_USER, session.userName);
  writeCookie(COOKIE_TOKEN, session.token);
}

export function getSession(): AuthSession | null {
  const userName = readCookie(COOKIE_USER);
  const token = readCookie(COOKIE_TOKEN);
  if (!userName || !token) return null;
  return { userName, token };
}

export function clearSession() {
  writeCookie(COOKIE_USER, "", 0);
  writeCookie(COOKIE_TOKEN, "", 0);
}
