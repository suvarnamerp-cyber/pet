"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Plus } from "lucide-react";
import toast from "react-hot-toast";
import PetCard from "@/components/PetCard";
import PetFormModal from "@/components/PetFormModal";
import QrModal from "@/components/QrModal";
import EmptyState from "@/components/EmptyState";
import { clearSession, getSession } from "@/lib/auth-session";
import { createPet, deletePetByPublicUrl, fetchPetInventory } from "@/lib/api";
import type { AuthSession, PetFormPayload, PetInfo } from "@/lib/types";

export default function DashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [pets, setPets] = useState<PetInfo[]>([]);
  const [activePet, setActivePet] = useState<PetInfo | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [loadingPets, setLoadingPets] = useState(true);
  const [savingPet, setSavingPet] = useState(false);

  const loadPets = useCallback(async (auth: AuthSession) => {
    const list = await fetchPetInventory(auth.token);
    setPets(list);
  }, []);

  useEffect(() => {
    const current = getSession();
    if (!current) {
      router.replace("/");
      return;
    }

    setSession(current);
    loadPets(current)
      .catch(() => console.log("Could not load pets"))
      .finally(() => setLoadingPets(false));
  }, [router, loadPets]);

  const greeting = useMemo(() => {
    if (!session) return "";
    return `Welcome, ${session.userName}`;
  }, [session]);

  async function handleSavePet(payload: PetFormPayload) {
    if (!session) return;
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
    setActivePet(pet);
    setShowForm(true);
  }

  async function handleDelete(pet: PetInfo) {
    if (!session || !pet.publicUrl) return;

    try {
      await deletePetByPublicUrl(pet.publicUrl, session.token);
      await loadPets(session);
      toast.success("Pet deleted");
    } catch {
      toast.error("Could not delete pet");
    }
  }

  function handleQr(pet: PetInfo) {
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
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-500">
              Owner dashboard
            </p>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-full border border-amber-200 bg-white px-4 py-2 text-sm font-semibold text-ink-700"
            >
              <LogOut size={16} />
              Log out
            </button>
          </div>
          <h2 className="mb-2 text-3xl font-semibold text-ink-900">
            {greeting}
          </h2>
          <p className="mt-2 text-sm text-ink-600">
            Add your pets, generate QR tags, and keep contact details updated.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-[2fr,1fr]">
          <div className="rounded-3xl bg-white/80 p-4 shadow-soft">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-ink-900">Your pets</h3>
              <button
                type="button"
                onClick={() => {
                  setActivePet(null);
                  setShowForm(true);
                }}
                className="flex items-center gap-2 rounded-full border border-amber-200 bg-white px-4 py-2 text-sm font-semibold text-ink-700"
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
                  />
                ))}
              </div>
            )}
          </div>

          <div className="rounded-3xl bg-white/80 p-4 shadow-soft">
            <h3 className="text-xl font-semibold text-ink-900">Account</h3>
            <div className="mt-4 space-y-3 text-sm text-ink-700">
              <div className="rounded-2xl border border-amber-100 bg-white p-4">
                <p className="text-xs uppercase tracking-wide text-ink-500">
                  User name
                </p>
                <p className="mt-1 text-base font-semibold text-ink-900">
                  {session.userName}
                </p>
              </div>
              <div className="rounded-2xl border border-amber-100 bg-white p-4">
                <p className="text-xs uppercase tracking-wide text-ink-500">
                  Total pets
                </p>
                <p className="mt-1 text-base font-semibold text-ink-900">
                  {pets.length}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <PetFormModal
        open={showForm}
        pet={activePet}
        defaultOwnerName={session.userName}
        onClose={() => {
          if (savingPet) return;
          setShowForm(false);
          setActivePet(null);
        }}
        onSave={handleSavePet}
      />

      {activePet && (
        <QrModal
          open={showQr}
          onClose={() => setShowQr(false)}
          pet={activePet}
        />
      )}
    </main>
  );
}
