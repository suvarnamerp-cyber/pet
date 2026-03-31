"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Client, type IMessage, type StompSubscription } from "@stomp/stompjs";
import { ChevronDown, LogOut, MapPin, Plus, RefreshCcw } from "lucide-react";
import toast from "react-hot-toast";
import PetCard from "@/components/PetCard";
import PetFormModal from "@/components/PetFormModal";
import QrModal from "@/components/QrModal";
import EmptyState from "@/components/EmptyState";
import { clearSession, getSession } from "@/lib/auth-session";
import {
  createPet,
  deletePetByPublicUrl,
  fetchPetInventory,
  fetchScanEvents,
} from "@/lib/api";
import type {
  AuthSession,
  PetFormPayload,
  PetInfo,
  ScanEvent,
} from "@/lib/types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://192.168.1.34:8088";

function toWebSocketUrl(baseUrl: string) {
  if (baseUrl.startsWith("https://")) return baseUrl.replace("https://", "wss://");
  if (baseUrl.startsWith("http://")) return baseUrl.replace("http://", "ws://");
  return baseUrl;
}

function parseScanMessage(message: IMessage): ScanEvent | null {
  try {
    const parsed = JSON.parse(message.body) as ScanEvent;
    if (!parsed || typeof parsed !== "object" || !parsed.publicUrl) return null;
    return parsed;
  } catch {
    return null;
  }
}

export default function DashboardPage() {
  const router = useRouter();
  const clientRef = useRef<Client | null>(null);
  const subscriptionRef = useRef<StompSubscription | null>(null);

  const [session, setSession] = useState<AuthSession | null>(null);
  const [pets, setPets] = useState<PetInfo[]>([]);
  const [activePet, setActivePet] = useState<PetInfo | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [loadingPets, setLoadingPets] = useState(true);
  const [savingPet, setSavingPet] = useState(false);
  const [deletingPublicUrl, setDeletingPublicUrl] = useState<string | null>(null);

  const [selectedScanPublicUrl, setSelectedScanPublicUrl] = useState("");
  const [scanEvents, setScanEvents] = useState<ScanEvent[]>([]);
  const [loadingScans, setLoadingScans] = useState(false);
  const [scanError, setScanError] = useState("");
  const [wsConnected, setWsConnected] = useState(false);

  const loadPets = useCallback(async (auth: AuthSession) => {
    const list = await fetchPetInventory(auth.token);
    setPets(list);
  }, []);

  const loadScans = useCallback(async (publicUrl: string, token?: string) => {
    if (!publicUrl) {
      setScanEvents([]);
      setScanError("");
      return;
    }

    setLoadingScans(true);
    try {
      const list = await fetchScanEvents(publicUrl, token);
      setScanEvents(list.slice().reverse());
      setScanError("");
    } catch {
      setScanEvents([]);
      setScanError("Could not load scan activity right now.");
    } finally {
      setLoadingScans(false);
    }
  }, []);

  useEffect(() => {
    const current = getSession();
    if (!current) {
      router.replace("/");
      return;
    }

    setSession(current);
    loadPets(current)
      .catch(() => toast.error("Could not load pets"))
      .finally(() => setLoadingPets(false));
  }, [router, loadPets]);

  useEffect(() => {
    const hasSelectedPet = pets.some((pet) => pet.publicUrl === selectedScanPublicUrl);
    if (!hasSelectedPet) {
      const fallback = pets.find((pet) => !!pet.publicUrl)?.publicUrl || "";
      setSelectedScanPublicUrl(fallback);
    }
  }, [pets, selectedScanPublicUrl]);

  useEffect(() => {
    if (!selectedScanPublicUrl) {
      setScanEvents([]);
      setScanError("");
      return;
    }
    loadScans(selectedScanPublicUrl, session?.token);
  }, [selectedScanPublicUrl, session?.token, loadScans]);

  useEffect(() => {
    const wsBaseUrl = toWebSocketUrl(API_BASE);
    const client = new Client({
      brokerURL: `${wsBaseUrl}/ws`,
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
    });

    client.onConnect = () => {
      setWsConnected(true);
    };

    client.onWebSocketClose = () => {
      setWsConnected(false);
    };

    client.onStompError = () => {
      setWsConnected(false);
    };

    clientRef.current = client;
    client.activate();

    return () => {
      subscriptionRef.current?.unsubscribe();
      subscriptionRef.current = null;
      client.deactivate();
      clientRef.current = null;
      setWsConnected(false);
    };
  }, []);

  useEffect(() => {
    const client = clientRef.current;
    if (!client || !wsConnected || !selectedScanPublicUrl) return;

    subscriptionRef.current?.unsubscribe();
    subscriptionRef.current = client.subscribe(`/topic/scan/${selectedScanPublicUrl}`, (message) => {
      const event = parseScanMessage(message);
      if (!event) return;
      setScanError("");
      setScanEvents((prev) => {
        const exists = prev.some(
          (item) =>
            item.scanTime === event.scanTime &&
            item.eventType === event.eventType &&
            item.publicUrl === event.publicUrl,
        );
        if (exists) return prev;
        return [event, ...prev].slice(0, 20);
      });
    });

    return () => {
      subscriptionRef.current?.unsubscribe();
      subscriptionRef.current = null;
    };
  }, [wsConnected, selectedScanPublicUrl]);

  const greeting = useMemo(() => {
    if (!session) return "";
    return `Welcome, ${session.userName}`;
  }, [session]);

  const scanPetOptions = useMemo(() => pets.filter((pet) => !!pet.publicUrl), [pets]);

  async function handleSavePet(payload: PetFormPayload) {
    if (!session || savingPet) return;
    setSavingPet(true);

    try {
      if (activePet?.publicUrl) {
        await deletePetByPublicUrl(activePet.publicUrl, session.token);
      }

      await createPet(payload, session.token);
      await loadPets(session);
      toast.success(activePet ? "Pet updated" : "Pet added");
      setShowForm(false);
      setActivePet(null);
    } catch {
      toast.error("Could not save pet");
    } finally {
      setSavingPet(false);
    }
  }

  function handleEdit(pet: PetInfo) {
    if (savingPet || deletingPublicUrl) return;
    setActivePet(pet);
    setShowForm(true);
  }

  async function handleDelete(pet: PetInfo) {
    if (!session || !pet.publicUrl || deletingPublicUrl) return;

    setDeletingPublicUrl(pet.publicUrl);
    try {
      await deletePetByPublicUrl(pet.publicUrl, session.token);
      toast.success("Pet deleted");

      try {
        await loadPets(session);
      } catch {
        toast.error("Pet deleted, but list refresh failed");
      }
    } catch {
      toast.error("Could not delete pet");
    } finally {
      setDeletingPublicUrl(null);
    }
  }

  function handleQr(pet: PetInfo) {
    if (savingPet || deletingPublicUrl) return;
    setActivePet(pet);
    setShowQr(true);
  }

  function handleLogout() {
    clearSession();
    toast.success("Logged out successfully");
    router.replace("/");
  }

  if (!session) return null;

  return (
    <main className="min-h-screen bg-noise p-4">
      <div className="mx-auto flex max-w-6xl flex-col gap-4">
        <section className="rounded-3xl bg-white/80 p-4 shadow-soft">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-500">Owner dashboard</p>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-full border border-amber-200 bg-white px-4 py-2 text-sm font-semibold text-ink-700"
            >
              <LogOut size={16} />
              Log out
            </button>
          </div>
          <h2 className="mb-2 text-3xl font-semibold text-ink-900">{greeting}</h2>
          <p className="mt-2 text-sm text-ink-600">Add your pets, generate QR tags, and keep contact details updated.</p>
        </section>

        <section className="grid gap-4 md:grid-cols-[2fr,1fr]">
          <div className="rounded-3xl bg-white/80 p-4 shadow-soft">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-ink-900">Your pets</h3>
              <button
                type="button"
                disabled={savingPet || !!deletingPublicUrl}
                onClick={() => {
                  setActivePet(null);
                  setShowForm(true);
                }}
                className="flex items-center gap-2 rounded-full border border-amber-200 bg-white px-4 py-2 text-sm font-semibold text-ink-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Plus size={16} />
                Add pet
              </button>
            </div>

            {loadingPets ? (
              <p className="mt-4 text-sm text-ink-600">Loading pets...</p>
            ) : pets.length === 0 ? (
              <div className="mt-4">
                <EmptyState onAdd={() => setShowForm(true)} />
              </div>
            ) : (
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {pets.map((pet) => (
                  <PetCard
                    key={pet.publicUrl || `${pet.ownerName}-${pet.petName}`}
                    pet={pet}
                    onEdit={() => handleEdit(pet)}
                    onDelete={() => handleDelete(pet)}
                    onQr={() => handleQr(pet)}
                    isDeleting={deletingPublicUrl === pet.publicUrl}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl bg-white/80 p-4 shadow-soft">
              <h3 className="text-xl font-semibold text-ink-900">Account</h3>
              <div className="mt-4 space-y-3 text-sm text-ink-700">
                <div className="rounded-2xl border border-amber-100 bg-white p-4">
                  <p className="text-xs uppercase tracking-wide text-ink-500">User name</p>
                  <p className="mt-1 text-base font-semibold text-ink-900">{session.userName}</p>
                </div>
                <div className="rounded-2xl border border-amber-100 bg-white p-4">
                  <p className="text-xs uppercase tracking-wide text-ink-500">Total pets</p>
                  <p className="mt-1 text-base font-semibold text-ink-900">{pets.length}</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white/80 p-4 shadow-soft">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-xl font-semibold text-ink-900">Scan Activity</h3>
                <button
                  type="button"
                  disabled={!selectedScanPublicUrl || loadingScans}
                  onClick={() => loadScans(selectedScanPublicUrl, session.token)}
                  className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white px-3 py-2 text-xs font-semibold text-ink-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <RefreshCcw size={14} />
                  Refresh
                </button>
              </div>

              <p className="mt-2 text-xs text-ink-500">
                Live socket: {wsConnected ? "Connected" : "Reconnecting"}
              </p>

              {scanPetOptions.length > 0 ? (
                <div className="mt-3 rounded-2xl border border-amber-100 bg-amber-50/70 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">Track Pet</p>
                  <div className="relative mt-2">
                    <select
                      value={selectedScanPublicUrl}
                      onChange={(event) => setSelectedScanPublicUrl(event.target.value)}
                      className="w-full appearance-none rounded-xl border border-amber-200 bg-white px-4 py-3 pr-10 text-sm font-semibold text-ink-800 shadow-sm focus:border-brand-400 focus:outline-none"
                    >
                      {scanPetOptions.map((pet) => (
                        <option key={pet.publicUrl} value={pet.publicUrl}>
                          {pet.petName}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-500" />
                  </div>
                </div>
              ) : (
                <p className="mt-3 text-sm text-ink-500">Add a pet with valid public URL to track scans.</p>
              )}

              <div className="mt-3 space-y-2">
                {loadingScans ? (
                  <p className="text-sm text-ink-500">Loading scan events...</p>
                ) : scanError ? (
                  <p className="text-sm text-rose-500">{scanError}</p>
                ) : scanEvents.length === 0 ? (
                  <p className="text-sm text-ink-500">No scans recorded yet.</p>
                ) : (
                  scanEvents.slice(0, 6).map((event, index) => (
                    <div
                      key={`${event.scanTime}-${index}`}
                      className="rounded-xl border border-amber-100 bg-white px-3 py-2 text-xs text-ink-700"
                    >
                      <p className="font-semibold">{event.eventType}</p>
                      <p>{new Date(event.scanTime).toLocaleString()}</p>
                      {event.latitude != null && event.longitude != null ? (
                        <a
                          className="mt-1 inline-flex items-center gap-1 text-brand-700 underline"
                          target="_blank"
                          rel="noreferrer"
                          href={`https://maps.google.com/?q=${event.latitude},${event.longitude}`}
                        >
                          <MapPin size={12} />
                          View location
                        </a>
                      ) : null}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      <PetFormModal
        open={showForm}
        pet={activePet}
        saving={savingPet}
        defaultOwnerName={session.userName}
        onClose={() => {
          if (savingPet) return;
          setShowForm(false);
          setActivePet(null);
        }}
        onSave={handleSavePet}
      />

      {activePet && <QrModal open={showQr} onClose={() => setShowQr(false)} pet={activePet} />}
    </main>
  );
}
