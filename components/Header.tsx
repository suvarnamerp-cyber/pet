import Link from "next/link";
import { PawPrint } from "lucide-react";

export default function Header() {
  return (
    <header className="flex items-center justify-between gap-4">
      <Link href="/" className="flex items-center gap-2 text-xl font-semibold text-ink-900">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-500 text-white shadow-glow">
          <PawPrint size={20} />
        </span>
        PetTag
      </Link>
      <span className="rounded-full bg-white/70 px-4 py-2 text-sm font-medium text-ink-700 shadow-soft">
        QR tags for pets
      </span>
    </header>
  );
}
