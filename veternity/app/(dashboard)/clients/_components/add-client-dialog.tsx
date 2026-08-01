"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Cancel01Icon, Mail01Icon, MapPinIcon, PlusSignIcon, SmartPhone01Icon, UserIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { useState, type FormEvent, type ReactNode } from "react";
import type { Client } from "./data";

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  address: "",
};

function SectionLabel({ icon, title, hint }: { icon: IconSvgElement; title: string; hint: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-7 w-7 items-center justify-center rounded-md bg-card text-muted-foreground shadow-sm">
        <HugeiconsIcon icon={icon} className="h-3.5 w-3.5" strokeWidth={2.2} />
      </span>
      <div className="flex flex-col leading-tight">
        <span className="text-sm font-bold text-foreground">{title}</span>
        <span className="text-xs text-muted-foreground">{hint}</span>
      </div>
    </div>
  );
}

interface AddClientDialogProps {
  onAdd: (client: Client) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideTrigger?: boolean;
  initialName?: string;
  trigger?: ReactNode;
}

export function AddClientDialog({ onAdd, open, onOpenChange, hideTrigger, initialName, trigger }: AddClientDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const handleOpenChange = (next: boolean) => {
    if (isControlled) onOpenChange?.(next);
    else setInternalOpen(next);
    setForm(next ? { ...EMPTY_FORM, name: initialName ?? "" } : EMPTY_FORM);
  };

  const canSubmit = form.name.trim() !== "";

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    onAdd({
      id: `C${Math.floor(1000 + Math.random() * 9000)}`,
      name: form.name.trim(),
      email: form.email.trim() || "—",
      phone: form.phone.trim() || "—",
      address: form.address.trim() || "—",
      animalsCount: 0,
    });

    handleOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {!hideTrigger && (
        <DialogTrigger asChild>
          {trigger ?? (
            <Button className="gap-1.5 bg-primary hover:bg-primary/90">
              <HugeiconsIcon icon={PlusSignIcon} className="h-4 w-4" strokeWidth={2.4} />
              Ajouter
            </Button>
          )}
        </DialogTrigger>
      )}

      <DialogContent className="max-h-[92vh] w-full max-w-lg gap-0 overflow-y-auto rounded-lg p-0 sm:max-w-lg" showCloseButton={false}>
        <div className="relative flex items-center justify-between bg-primary px-6 py-1.5 text-primary-foreground">
          <DialogHeader className="gap-0">
            <DialogTitle className="text-sm font-bold text-primary-foreground">Ajouter un client</DialogTitle>
          </DialogHeader>

          <button
            type="button"
            onClick={() => handleOpenChange(false)}
            className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-foreground/15 text-primary-foreground transition-colors hover:bg-primary-foreground/25"
          >
            <HugeiconsIcon icon={Cancel01Icon} className="h-3 w-3" strokeWidth={2.4} />
            <span className="sr-only">Fermer</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-6 pt-5 pb-3">
          <div className="flex flex-col gap-4 rounded-xl border border-border bg-muted p-5">
            <SectionLabel icon={UserIcon} title="Informations du client" hint="Coordonnées du nouveau propriétaire" />

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="client-name">Nom complet *</Label>
              <div className="relative">
                <HugeiconsIcon
                  icon={UserIcon}
                  className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  strokeWidth={2}
                />
                <Input
                  id="client-name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Ex: Salma Idrissi"
                  className="h-11 bg-white pl-9"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="client-phone">Téléphone</Label>
                <div className="relative">
                  <HugeiconsIcon
                    icon={SmartPhone01Icon}
                    className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    strokeWidth={2}
                  />
                  <Input
                    id="client-phone"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    placeholder="+212 661 234 567"
                    className="h-11 bg-white pl-9"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="client-email">Email</Label>
                <div className="relative">
                  <HugeiconsIcon
                    icon={Mail01Icon}
                    className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    strokeWidth={2}
                  />
                  <Input
                    id="client-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="nom@email.com"
                    className="h-11 bg-white pl-9"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="client-address">Adresse</Label>
              <div className="relative">
                <HugeiconsIcon
                  icon={MapPinIcon}
                  className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  strokeWidth={2}
                />
                <Input
                  id="client-address"
                  value={form.address}
                  onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                  placeholder="Ex: 12 Rue Al Massira, Casablanca"
                  className="h-11 bg-white pl-9"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={!canSubmit} className="gap-1.5 bg-primary hover:bg-primary/90">
              Enregistrer le client
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
