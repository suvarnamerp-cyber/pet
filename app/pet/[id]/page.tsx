"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { MessageCircle, PhoneCall, ShieldCheck } from "lucide-react";
import { fetchPetByPublicUrl, postScanEvent, resolveImageUrl } from "@/lib/api";
import type { PetInfo } from "@/lib/types";

export default function PetProfilePage() {
  const params = useParams<{ id: string }>();
  const [pet, setPet] = useState<PetInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [scanMessage, setScanMessage] = useState("");

  const publicUrl = useMemo(() => decodeURIComponent(params.id || ""), [params.id]);

  useEffect(() => {
    async function loadPet() {
      try {
        setLoading(true);
        setError("");
        const details = await fetchPetByPublicUrl(publicUrl);
        setPet(details);
      } catch {
        setError("Unable to load pet details");
      } finally {
        setLoading(false);
      }
    }

    if (!publicUrl) {
      setError("Invalid pet link");
      setLoading(false);
      return;
    }

    loadPet();
  }, [publicUrl]);

  useEffect(() => {
    if (!publicUrl) return;

    let cancelled = false;

    async function reportScanFlow() {
      try {
        await postScanEvent(publicUrl, { eventType: "SCAN_OPENED" });
      } catch {
        // Do not block UI if tracking fails
      }

      if (!("geolocation" in navigator)) {
        try {
          await postScanEvent(publicUrl, { eventType: "LOCATION_DENIED" });
        } catch {
          // ignore
        }
        if (!cancelled) setScanMessage("Location not supported on this device.");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            await postScanEvent(publicUrl, {
              eventType: "LOCATION_SHARED",
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
            });
            if (!cancelled) setScanMessage("Thanks. Location shared with owner.");
          } catch {
            if (!cancelled) setScanMessage("Location captured but could not be sent.");
          }
        },
        async () => {
          try {
            await postScanEvent(publicUrl, { eventType: "LOCATION_DENIED" });
          } catch {
            // ignore
          }
          if (!cancelled) setScanMessage("Location permission denied.");
        },
        {
          enableHighAccuracy: true,
          timeout: 12000,
          maximumAge: 0,
        },
      );
    }

    reportScanFlow();

    return () => {
      cancelled = true;
    };
  }, [publicUrl]);

  const callHref = pet ? `tel:${pet.phone}` : "#";
  const whatsappHref = pet ? `https://wa.me/${pet.phone.replace(/\D/g, "")}` : "#";

  return (
    <main className="min-h-screen bg-hero p-4">
      <div className="mx-auto flex max-w-3xl flex-col gap-4">
        <div className="flex flex-col items-center gap-2 rounded-3xl bg-white/80 p-4 text-center shadow-soft">
          <span className="rounded-full bg-brand-100 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700">
            Found a pet?
          </span>
          <h1 className="text-3xl font-semibold text-ink-900 sm:text-4xl">Help {pet?.petName || "this pet"} get home</h1>
          <p className="text-sm text-ink-600">Please contact the owner below. Thank you for caring.</p>
          {scanMessage ? <p className="text-xs text-ink-500">{scanMessage}</p> : null}
        </div>

        <div className="rounded-3xl bg-white p-4 shadow-soft">
          {loading ? (
            <p className="text-sm text-ink-600">Loading pet details...</p>
          ) : error ? (
            <p className="text-sm text-rose-500">{error}</p>
          ) : (
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <img
                src={resolveImageUrl(pet?.imagePath || "")}
                alt={pet?.petName || "Pet"}
                className="h-48 w-full rounded-2xl object-cover md:h-52 md:w-52"
              />
              <div className="flex-1 space-y-2">
                <div>
                  <p className="text-xs uppercase tracking-wide text-ink-500">Pet name</p>
                  <p className="text-2xl font-semibold text-ink-900">{pet?.petName}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-ink-500">Owner</p>
                  <p className="text-lg font-semibold text-ink-900">{pet?.ownerName}</p>
                </div>
                <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm text-ink-700">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-brand-600" />
                    Please call or message to reunite this pet safely.
                  </div>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <a
                    href={callHref}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-amber-200 bg-brand-500 px-4 py-3 text-sm font-semibold shadow-glow"
                  >
                    <PhoneCall size={16} />
                    Call owner
                  </a>
                  <a
                    href={whatsappHref}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-amber-200 px-4 py-3 text-sm font-semibold text-ink-700"
                  >
                    <MessageCircle size={16} />
                    WhatsApp
                  </a>
                </div>
                <p className="text-xs text-ink-500">Contact: {pet?.phone}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
