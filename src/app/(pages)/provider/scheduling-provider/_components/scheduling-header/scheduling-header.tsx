import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function SchedulingHeader() {
  return (
    <header className="sticky top-0 z-10 w-full bg-primary text-primary-foreground shadow-sm">
      <div className="flex h-16 w-full items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Link
            href="/provider"
            className="flex items-center justify-center rounded-full p-2 transition-colors hover:bg-white/20"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <h1 className="text-lg font-semibold tracking-tight">Agenda</h1>
        </div>
        <Image
          src="/img/logo-opened.png"
          alt="Agilis"
          width={80}
          height={32}
          className="object-contain"
          priority
        />
      </div>
    </header>
  );
}
