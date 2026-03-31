import type {
  AuthFormState,
  AuthSession,
  PetFormPayload,
  PetInfo,
  ScanEvent,
  ScanEventRequest,
} from "./types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://192.168.1.34:8088";

function authHeaders(token?: string): HeadersInit {
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

function normalizePets(data: unknown): PetInfo[] {
  if (Array.isArray(data)) return data as PetInfo[];
  if (data && typeof data === "object" && "petName" in data)
    return [data as PetInfo];
  return [];
}

function normalizeScans(data: unknown): ScanEvent[] {
  if (Array.isArray(data)) return data as ScanEvent[];
  if (data && typeof data === "object" && "eventType" in data)
    return [data as ScanEvent];
  return [];
}

export async function signup(data: AuthFormState): Promise<string> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const text = await res.text();
  if (!res.ok) throw new Error(text || "Signup failed");
  return text;
}

export async function login(data: AuthFormState): Promise<AuthSession> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Login failed");
  }
  return res.json();
}

export async function createPet(payload: PetFormPayload, token: string) {
  const formData = new FormData();
  const dto = {
    petName: payload.petName,
    ownerName: payload.ownerName,
    phone: payload.phone,
  };

  formData.append(
    "userInfoDTO",
    new Blob([JSON.stringify(dto)], { type: "application/json" }),
  );

  if (payload.photo) {
    formData.append("photo", payload.photo);
  }

  const res = await fetch(`${API_BASE}/info/create`, {
    method: "POST",
    headers: authHeaders(token),
    body: formData,
  });

  if (!res.ok) throw new Error("Failed to create pet");
  return res.text();
}

export async function fetchPetInventory(token: string): Promise<PetInfo[]> {
  const res = await fetch(`${API_BASE}/info`, {
    method: "GET",
    headers: authHeaders(token),
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch pets");
  const data = await res.json();
  return normalizePets(data);
}

export async function fetchPetByPublicUrl(publicUrl: string): Promise<PetInfo> {
  const res = await fetch(
    `${API_BASE}/info/get/${encodeURIComponent(publicUrl)}`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  if (!res.ok) throw new Error("Failed to fetch pet details");
  return res.json();
}

export async function deletePetByPublicUrl(publicUrl: string, token: string) {
  const res = await fetch(`${API_BASE}/info/${encodeURIComponent(publicUrl)}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });

  const message = await res.text();
  const looksDeleted = message.toLowerCase().includes("deleted");

  if (!res.ok && !looksDeleted) {
    throw new Error("Failed to delete pet");
  }

  return message;
}

export async function postScanEvent(publicUrl: string, payload: ScanEventRequest) {
  const res = await fetch(`${API_BASE}/scan/${encodeURIComponent(publicUrl)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to report scan event");
}

export async function fetchScanEvents(publicUrl: string, token?: string): Promise<ScanEvent[]> {
  const res = await fetch(`${API_BASE}/scan/${encodeURIComponent(publicUrl)}`, {
    method: "GET",
    headers: authHeaders(token),
    cache: "no-store",
  });

  if (res.status === 404) return [];

  const raw = await res.text();

  if (!res.ok) throw new Error("Failed to fetch scan events");
  if (!raw.trim()) return [];

  try {
    return normalizeScans(JSON.parse(raw));
  } catch {
    return [];
  }
}

export function resolveImageUrl(imagePath: string) {
  if (!imagePath) return "/pet-placeholder.svg";
  if (
    imagePath.startsWith("http://") ||
    imagePath.startsWith("https://") ||
    imagePath.startsWith("data:")
  ) {
    return imagePath;
  }
  return `${API_BASE}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
}
