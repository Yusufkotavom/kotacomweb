import Link from "next/link";
import { MessageCircle } from "lucide-react";

import { toWhatsappHref } from "@/lib/site";

import { cn } from "@/lib/utils";

type FloatingWhatsappProps = {
  number: string;
  className?: string;
};

export function FloatingWhatsapp({ number, className }: FloatingWhatsappProps) {
  return (
    <Link
      href={toWhatsappHref(number, "Halo Kotacom, saya ingin konsultasi cepat via WhatsApp.")}
      className={cn(
        "fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full border border-emerald-400/40",
        "bg-emerald-500 px-4 py-3 text-sm font-medium text-emerald-950 shadow-[0_10px_35px_rgba(16,185,129,0.35)]",
        "transition-transform hover:-translate-y-0.5 hover:bg-emerald-400",
        className,
      )}
      aria-label="Chat WhatsApp"
    >
      <MessageCircle className="size-4" />
      <span className="hidden sm:inline">WhatsApp</span>
    </Link>
  );
}
