import AuthCard from "@/components/AuthCard";
import Header from "@/components/Header";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-hero px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-12">
        <Header />
        <div className="grid gap-10 lg:grid-cols-[1.1fr,0.9fr]">
          <AuthCard />
        </div>
      </div>
    </main>
  );
}

{
  /* <div className="flex flex-col justify-center gap-6">
            <div className="rounded-3xl bg-white/60 p-6 shadow-soft">
              <p className="text-sm font-semibold uppercase tracking-wide text-brand-500">Pet safety made simple</p>
              <h1 className="mt-4 text-4xl font-semibold text-ink-900 sm:text-5xl">
                Printable QR tags that bring lost pets home faster.
              </h1>
              <p className="mt-4 text-base text-ink-700">
                Add your pet once, generate a beautiful QR tag, and let finders reach you in one tap.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-white/80 p-5 shadow-soft">
                <p className="text-sm font-semibold text-ink-800">Instant contact</p>
                <p className="mt-2 text-sm text-ink-600">Finder sees your pet photo and can call immediately.</p>
              </div>
              <div className="rounded-2xl bg-white/80 p-5 shadow-soft">
                <p className="text-sm font-semibold text-ink-800">Beautiful tags</p>
                <p className="mt-2 text-sm text-ink-600">Download or print a cozy QR label for each pet.</p>
              </div>
            </div>
          </div> */
}
