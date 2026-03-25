"use client";

import { useEffect, useState } from "react";
import Modal from "./Modal";
import type { PetFormPayload, PetInfo } from "@/lib/types";

const emptyDraft: PetFormPayload = {
  petName: "",
  ownerName: "",
  phone: "",
  photo: null
};

type PetFormModalProps = {
  open: boolean;
  onClose: () => void;
  onSave: (payload: PetFormPayload) => void;
  pet?: PetInfo | null;
  defaultOwnerName?: string;
};

export default function PetFormModal({ open, onClose, onSave, pet, defaultOwnerName }: PetFormModalProps) {
  const [draft, setDraft] = useState<PetFormPayload>(emptyDraft);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (pet) {
      setDraft({
        petName: pet.petName,
        ownerName: pet.ownerName,
        phone: pet.phone,
        photo: null
      });
      setPreview(pet.imagePath);
      return;
    }

    setDraft({ ...emptyDraft, ownerName: defaultOwnerName || "" });
    setPreview("");
  }, [pet, open, defaultOwnerName]);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setDraft((prev) => ({ ...prev, photo: file }));

    const reader = new FileReader();
    reader.onload = () => {
      setPreview((reader.result as string) || "");
    };
    reader.readAsDataURL(file);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave(draft);
  }

  return (
    <Modal open={open} onClose={onClose} title={pet ? "Edit pet" : "Add a new pet"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-sm font-medium text-ink-700">
          Pet name
          <input
            required
            type="text"
            value={draft.petName}
            onChange={(event) => setDraft({ ...draft, petName: event.target.value })}
            placeholder="Milo"
            className="mt-2 w-full rounded-xl border border-amber-100 bg-white px-4 py-3 text-ink-900 focus:border-brand-400 focus:outline-none"
          />
        </label>

        <label className="block text-sm font-medium text-ink-700">
          Owner name
          <input
            required
            type="text"
            value={draft.ownerName}
            onChange={(event) => setDraft({ ...draft, ownerName: event.target.value })}
            placeholder="Owner full name"
            className="mt-2 w-full rounded-xl border border-amber-100 bg-white px-4 py-3 text-ink-900 focus:border-brand-400 focus:outline-none"
          />
        </label>

        <label className="block text-sm font-medium text-ink-700">
          Contact number
          <input
            required
            type="tel"
            value={draft.phone}
            onChange={(event) => setDraft({ ...draft, phone: event.target.value })}
            placeholder="+91 9876543210"
            className="mt-2 w-full rounded-xl border border-amber-100 bg-white px-4 py-3 text-ink-900 focus:border-brand-400 focus:outline-none"
          />
        </label>

        <label className="block text-sm font-medium text-ink-700">
          Pet photo
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-2 w-full rounded-xl border border-amber-100 bg-white px-4 py-3 text-ink-700"
          />
        </label>

        {preview ? (
          <img src={preview} alt="Pet preview" className="h-40 w-full rounded-2xl object-cover" />
        ) : (
          <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-amber-200 bg-amber-50 text-sm text-ink-500">
            Upload a happy photo of your pet
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-amber-200 px-4 py-3 text-sm font-semibold text-ink-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 rounded-xl border border-amber-200 bg-brand-500 px-4 py-3 text-sm font-semibold shadow-glow"
          >
            Save pet
          </button>
        </div>
      </form>
    </Modal>
  );
}
