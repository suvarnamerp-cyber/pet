"use client";

import { useMemo, useState } from "react";
import { Copy, Download, ExternalLink, Printer } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import Modal from "./Modal";
import { buildPetQrUrl } from "@/lib/qr";
import type { PetInfo } from "@/lib/types";

type QrModalProps = {
  open: boolean;
  onClose: () => void;
  pet: PetInfo;
};

export default function QrModal({ open, onClose, pet }: QrModalProps) {
  const [copied, setCopied] = useState(false);

  const qrUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return buildPetQrUrl(window.location.origin, pet);
  }, [pet]);

  function getCanvas() {
    return document.getElementById("pet-qr") as HTMLCanvasElement | null;
  }

  function handleDownload() {
    const canvas = getCanvas();
    if (!canvas) return;

    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `${pet.petName}-qr.png`;
    link.click();
  }

  function handlePrint() {
    const canvas = getCanvas();
    if (!canvas) return;

    const dataUrl = canvas.toDataURL("image/png");
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head><title>${pet.petName} QR</title></head>
        <body style="display:flex;align-items:center;justify-content:center;height:100vh;">
          <img src="${dataUrl}" alt="QR" style="width:320px;height:320px;" />
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  }

  async function handleCopy() {
    if (!qrUrl) return;

    try {
      await navigator.clipboard.writeText(qrUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={`QR tag for ${pet.petName}`}>
      <div className="grid gap-6 md:grid-cols-[240px,1fr]">
        <div className="m-auto rounded-2xl border border-amber-100 bg-amber-50 p-4">
          {qrUrl && <QRCodeCanvas id="pet-qr" value={qrUrl} size={200} includeMargin />}
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-amber-100 bg-white px-4 py-3 text-sm text-ink-600">
            This QR links to your pet profile. Print it and attach to the collar.
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={handleDownload}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-amber-200 bg-brand-500 px-4 py-3 text-sm font-semibold"
            >
              <Download size={16} />
              Download PNG
            </button>

            <a
              href={qrUrl}
              target="_blank"
              rel="noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-amber-200 bg-white px-4 py-3 text-sm font-semibold text-ink-700"
            >
              <ExternalLink size={16} />
              View pet page
            </a>

            <button
              type="button"
              onClick={handleCopy}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-amber-200 px-4 py-3 text-sm font-semibold text-ink-700"
            >
              <Copy size={16} />
              {copied ? "Copied!" : "Copy link"}
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-amber-200 px-4 py-3 text-sm font-semibold text-ink-700"
            >
              <Printer size={16} />
              Print tag
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
