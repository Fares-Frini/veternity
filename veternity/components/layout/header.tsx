"use client";

import { useState } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BellIcon, ChevronDownIcon, LogOutIcon, SearchIcon } from "./icons";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="flex h-16 w-full shrink-0 items-center gap-6 border-b border-border bg-card px-8">
      <div className="flex shrink-0 items-center gap-2.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent">
          <Image src="/logos/logo_color.png" alt="Veternity" width={22} height={22} className="rounded-sm" />
        </div>
        <span className="text-lg font-extrabold tracking-tight text-foreground">Veternity</span>
      </div>

      <div className="flex h-10 w-full max-w-md items-center gap-2 rounded-full border border-border bg-muted px-4">
        <SearchIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
        <input
          type="text"
          placeholder="Rechercher un animal, un client..."
          className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
      </div>

      <div className="flex flex-1 items-center justify-end gap-3">
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <BellIcon className="h-5 w-5" />
          <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-status-pink ring-2 ring-card" />
        </button>

        <div className="h-8 w-px bg-border" />

        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2.5 rounded-full py-1 pr-2 pl-1 transition-colors hover:bg-accent"
          >
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-primary font-bold text-primary-foreground">NK</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start leading-tight">
              <span className="text-sm font-semibold text-foreground">Dr. Kadiri</span>
              <span className="text-xs text-muted-foreground">Vétérinaire</span>
            </div>
            <ChevronDownIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
          </button>

          {menuOpen && (
            <div className="absolute top-full right-0 z-30 mt-2 w-48 overflow-hidden rounded-md border border-border bg-card py-1 shadow-lg">
              <button
                type="button"
                className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-status-danger-bg hover:text-status-danger"
              >
                <LogOutIcon className="h-4 w-4" />
                Se déconnecter
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
