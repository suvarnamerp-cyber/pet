import type { Metadata } from "next";
import { Fredoka } from "next/font/google";
import AppToaster from "@/components/AppToaster";
import "./globals.css";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap"
});

export const metadata: Metadata = {
  title: "PetTag - Find My Pet",
  description: "Create a QR tag so lost pets can find their way home."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={fredoka.className}>
      <body className="bg-amber-50 text-ink-900">
        <AppToaster />
        {children}
      </body>
    </html>
  );
}
