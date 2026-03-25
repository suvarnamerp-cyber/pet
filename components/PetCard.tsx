import { Pencil, QrCode, Trash2 } from "lucide-react";
import { resolveImageUrl } from "@/lib/api";
import type { PetInfo } from "@/lib/types";

type PetCardProps = {
  pet: PetInfo;
  onEdit: () => void;
  onDelete: () => void;
  onQr: () => void;
};

export default function PetCard({ pet, onEdit, onDelete, onQr }: PetCardProps) {
  return (
    <div className="flex flex-col rounded-2xl border border-amber-100 bg-white p-4 shadow-soft">
      <div className="flex items-center gap-4">
        <img src={resolveImageUrl(pet.imagePath)} alt={pet.petName} className="h-20 w-20 rounded-2xl object-cover" />
        <div>
          <p className="text-lg font-semibold text-ink-900">{pet.petName}</p>
          <p className="text-xs text-ink-500">Owner: {pet.ownerName}</p>
          {pet.publicUrl ? <p className="text-xs text-ink-400">ID: {pet.publicUrl}</p> : null}
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-xs font-semibold">
        <button
          type="button"
          onClick={onEdit}
          className="flex items-center justify-center gap-2 rounded-xl border border-amber-100 px-2 py-2 text-ink-700"
        >
          <Pencil size={14} />
          Edit
        </button>
        <button
          type="button"
          onClick={onQr}
          className="flex items-center justify-center gap-2 rounded-xl border border-amber-100 bg-brand-500 px-2 py-2"
        >
          <QrCode size={14} />
          QR
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="flex items-center justify-center gap-2 rounded-xl border border-amber-100 px-2 py-2 text-rose-500"
        >
          <Trash2 size={14} />
          Delete
        </button>
      </div>
    </div>
  );
}
