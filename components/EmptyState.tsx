import { Plus } from "lucide-react";

type EmptyStateProps = {
  onAdd: () => void;
};

export default function EmptyState({ onAdd }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-amber-200 bg-white/70 p-10 text-center">
      <p className="text-lg font-semibold text-ink-800">No pets yet</p>
      <p className="text-sm text-ink-600">Add your first pet to generate a QR tag.</p>
      {/* <button
        type="button"
        onClick={onAdd}
        className="flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold shadow-glow"
      >
        <Plus size={16} />
        Add pet
      </button> */}
    </div>
  );
}
