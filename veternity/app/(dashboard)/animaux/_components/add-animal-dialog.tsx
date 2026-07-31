"use client";

import { useState, type FormEvent } from "react";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  BirdIcon,
  Bone02Icon,
  CameraAdd01Icon,
  Cancel01Icon,
  CarrotIcon,
  Calendar03Icon,
  CatIcon,
  CheckmarkCircle02Icon,
  EggIcon,
  FemaleSymbolIcon,
  FloppyDiskIcon,
  FootprintsIcon,
  MaleSymbolIcon,
  NutIcon,
  PlusSignIcon,
  Scissor01Icon,
  Search01Icon,
  StethoscopeIcon,
  UserIcon,
  VaccineIcon,
} from "@hugeicons/core-free-icons";
import { PawIcon } from "@/components/layout/icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import type { Animal } from "./data";
import { AddClientDialog } from "../../clients/_components/add-client-dialog";
import type { Client } from "../../clients/_components/data";

const SPECIES_THEME: Record<string, { gradient: string; accent: string; soft: string }> = {
  Chat: {
    gradient: "from-[#8b5cf6] via-[#7c5cf0] to-[#5b3fc4]",
    accent: "#7c5cf0",
    soft: "border-status-purple/40 bg-status-purple-bg text-status-purple",
  },
  Chien: {
    gradient: "from-[#4f9dff] via-[#3b82f6] to-[#2563eb]",
    accent: "#3b82f6",
    soft: "border-status-info/40 bg-status-info-bg text-status-info",
  },
  Lapin: {
    gradient: "from-[#ffab3d] via-[#f5920a] to-[#d97a00]",
    accent: "#f5920a",
    soft: "border-status-warning/40 bg-status-warning-bg text-status-warning",
  },
  Oiseau: {
    gradient: "from-[#00b3a4] via-[#00998e] to-[#00706a]",
    accent: "#00998e",
    soft: "border-primary/40 bg-secondary text-secondary-foreground",
  },
  Rongeur: {
    gradient: "from-[#c9974f] via-[#a3763a] to-[#7d5a2c]",
    accent: "#a3763a",
    soft: "border-status-brown/40 bg-status-brown-bg text-status-brown",
  },
  Reptile: {
    gradient: "from-[#4ade80] via-[#16a34a] to-[#0f7a37]",
    accent: "#16a34a",
    soft: "border-status-success/40 bg-status-success-bg text-status-success",
  },
};
const ESPECE_OPTIONS = [
  { value: "Chat", icon: CatIcon },
  { value: "Chien", icon: FootprintsIcon },
  { value: "Lapin", icon: CarrotIcon },
  { value: "Oiseau", icon: BirdIcon },
  { value: "Rongeur", icon: NutIcon },
  { value: "Reptile", icon: EggIcon },
] as const;

const SEXE_OPTIONS = [
  { value: "M" as const, label: "Mâle", icon: MaleSymbolIcon, soft: "border-status-info/40 bg-status-info-bg text-status-info" },
  { value: "F" as const, label: "Femelle", icon: FemaleSymbolIcon, soft: "border-status-pink/40 bg-status-pink-bg text-status-pink" },
];

const ALLERGY_SUGGESTIONS = ["Pénicilline", "Pollen", "Acariens", "Puces", "Produits laitiers", "Poulet"];

const HISTORY_SUGGESTIONS = [
  "Stérilisation",
  "Fracture",
  "Otite chronique",
  "Insuffisance rénale",
  "Diabète",
  "Chirurgie dentaire",
];

const EMPTY_FORM = {
  name: "",
  species: "" as string,
  breed: "",
  sex: "" as "" | "M" | "F",
  coat: "",
  birthDate: "",
  weightKg: "",
  owner: "",
  vaccinated: false,
  sterilized: false,
  allergies: "",
  history: "",
};

/** Adds or removes `item` from a comma-separated field value, used by the suggestion chips. */
function toggleListValue(value: string, item: string) {
  const items = value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const exists = items.some((i) => i.toLowerCase() === item.toLowerCase());
  const next = exists ? items.filter((i) => i.toLowerCase() !== item.toLowerCase()) : [...items, item];
  return next.join(", ");
}

function SuggestionChips({
  items,
  value,
  onToggle,
  activeClass,
}: {
  items: string[];
  value: string;
  onToggle: (item: string) => void;
  activeClass: string;
}) {
  const selected = value
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => {
        const isActive = selected.includes(item.toLowerCase());
        return (
          <button
            key={item}
            type="button"
            onClick={() => onToggle(item)}
            className={cn(
              "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
              isActive ? activeClass : "border-border bg-card text-muted-foreground hover:border-border/60",
            )}
          >
            {item}
          </button>
        );
      })}
    </div>
  );
}

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

interface AddAnimalDialogProps {
  owners: string[];
  onAdd: (animal: Animal) => void;
  onAddClient: (client: Client) => void;
}

export function AddAnimalDialog({ owners, onAdd, onAddClient }: AddAnimalDialogProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [ownerOpen, setOwnerOpen] = useState(false);
  const [addClientOpen, setAddClientOpen] = useState(false);

  const avatarIcon = ESPECE_OPTIONS.find((o) => o.value === form.species)?.icon ?? FootprintsIcon;

  const ownerQuery = form.owner.trim().toLowerCase();
  const filteredOwners = ownerQuery
    ? owners.filter((owner) => owner.toLowerCase().includes(ownerQuery))
    : owners;
  const ownerExists = owners.some((owner) => owner.toLowerCase() === ownerQuery);

  const canSubmit = form.name.trim() !== "" && form.species !== "" && form.sex !== "";

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    onAdd({
      id: `A${Math.floor(1000 + Math.random() * 9000)}`,
      name: form.name.trim(),
      sex: form.sex as "M" | "F",
      species: form.species,
      breed: form.breed.trim() || "—",
      coat: form.coat.trim() || "—",
      birthDate: form.birthDate || new Date().toISOString().slice(0, 10),
      weightKg: form.weightKg ? Number(form.weightKg) : 0,
      owner: form.owner.trim() || "—",
    });

    setForm(EMPTY_FORM);
    setOpen(false);
  };

  return (
    <>
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          setForm(EMPTY_FORM);
          setOwnerOpen(false);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="gap-1.5 bg-primary hover:bg-primary/90">
          <HugeiconsIcon icon={PlusSignIcon} className="h-4 w-4" strokeWidth={2.4} />
          Ajouter
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[94vh] w-full max-w-5xl gap-0 overflow-y-auto rounded-lg p-0 sm:max-w-5xl" showCloseButton={false}>
        {/* Header fin */}
        <div className="relative flex items-center justify-between bg-primary px-6 py-1.5 text-primary-foreground">
          <DialogHeader className="gap-0">
            <DialogTitle className="text-sm font-bold text-primary-foreground">Ajouter un animal</DialogTitle>
          </DialogHeader>

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-foreground/15 text-primary-foreground transition-colors hover:bg-primary-foreground/25"
          >
            <HugeiconsIcon icon={Cancel01Icon} className="h-3 w-3" strokeWidth={2.4} />
            <span className="sr-only">Fermer</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 px-8 pt-6 pb-3">
          <div className="grid grid-cols-2 gap-x-10 gap-y-6">
            {/* Left column */}
            <div className="flex flex-col gap-6">
              {/* Identité */}
              <div className="flex flex-col gap-4 rounded-xl border border-border bg-muted p-5">
                <SectionLabel icon={Bone02Icon} title="Identité" hint="Nom, espèce, race et sexe de l'animal" />

                <div className="flex items-end gap-3">
                  <button
                    type="button"
                    className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-sm border border-border bg-card text-primary shadow-sm transition-transform hover:scale-[1.02]"
                  >
                    <HugeiconsIcon icon={avatarIcon} className="h-6 w-6" strokeWidth={2} />
                    <span className="absolute -right-1.5 -bottom-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground ring-2 ring-card">
                      <HugeiconsIcon icon={CameraAdd01Icon} className="h-2.5 w-2.5" strokeWidth={2.4} />
                    </span>
                  </button>

                  <div className="flex flex-1 flex-col gap-1.5">
                    <Label htmlFor="animal-name">Nom de l&apos;animal *</Label>
                    <Input
                      id="animal-name"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      placeholder="Ex: Luna"
                      className="h-11 bg-white"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label>Espèce *</Label>
                  <div className="grid grid-cols-6 gap-1">
                    {ESPECE_OPTIONS.map(({ value, icon }) => {
                      const isSelected = form.species === value;
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setForm((f) => ({ ...f, species: value }))}
                          className={cn(
                            "flex h-14 flex-col items-center justify-center gap-1 rounded-md border px-0.5 transition-colors",
                            isSelected ? SPECIES_THEME[value].soft : "border-border bg-card text-muted-foreground hover:bg-muted",
                          )}
                        >
                          <HugeiconsIcon icon={icon} className="h-3.5 w-3.5" strokeWidth={2} />
                          <span className="text-[10px] leading-none font-semibold">{value}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="animal-breed">Race</Label>
                    <Input
                      id="animal-breed"
                      value={form.breed}
                      onChange={(e) => setForm((f) => ({ ...f, breed: e.target.value }))}
                      placeholder="Ex: Persan"
                      className="h-11 bg-white"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label>Sexe *</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {SEXE_OPTIONS.map(({ value, label, icon, soft }) => {
                        const isSelected = form.sex === value;
                        return (
                          <button
                            key={value}
                            type="button"
                            onClick={() => setForm((f) => ({ ...f, sex: value }))}
                            className={cn(
                              "flex h-11 items-center justify-center gap-1.5 rounded-lg border text-sm font-medium transition-colors",
                              isSelected ? soft : "border-border bg-card text-muted-foreground hover:bg-muted",
                            )}
                          >
                            <HugeiconsIcon icon={icon} className="h-4 w-4" strokeWidth={2.2} />
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Propriétaire */}
              <div className="flex flex-col gap-4 rounded-xl border border-border bg-muted p-5">
                <SectionLabel icon={UserIcon} title="Propriétaire" hint="Le client rattaché à ce dossier" />

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="animal-owner">Client</Label>
                  <Popover open={ownerOpen} onOpenChange={setOwnerOpen}>
                    <PopoverAnchor asChild>
                      <div className="relative">
                        <HugeiconsIcon
                          icon={Search01Icon}
                          className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                          strokeWidth={2}
                        />
                        <Input
                          id="animal-owner"
                          value={form.owner}
                          onChange={(e) => {
                            setForm((f) => ({ ...f, owner: e.target.value }));
                            setOwnerOpen(true);
                          }}
                          onFocus={() => setOwnerOpen(true)}
                          placeholder="Rechercher un client..."
                          className="h-11 bg-white pl-9"
                          autoComplete="off"
                        />
                      </div>
                    </PopoverAnchor>
                    <PopoverContent
                      align="start"
                      onOpenAutoFocus={(e) => e.preventDefault()}
                      className="max-h-56 w-80 overflow-y-auto p-1"
                    >
                      {filteredOwners.length > 0 && (
                        <div className="flex flex-col gap-0.5">
                          {filteredOwners.map((owner) => (
                            <button
                              key={owner}
                              type="button"
                              onClick={() => {
                                setForm((f) => ({ ...f, owner }));
                                setOwnerOpen(false);
                              }}
                              className="flex items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm text-foreground hover:bg-muted"
                            >
                              <HugeiconsIcon icon={UserIcon} className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={2} />
                              {owner}
                            </button>
                          ))}
                        </div>
                      )}

                      {form.owner.trim() !== "" && !ownerExists && (
                        <button
                          type="button"
                          onClick={() => {
                            setOwnerOpen(false);
                            setAddClientOpen(true);
                          }}
                          className={cn(
                            "flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm font-medium text-primary hover:bg-secondary",
                            filteredOwners.length > 0 && "mt-1 border-t border-border pt-2",
                          )}
                        >
                          <HugeiconsIcon icon={PlusSignIcon} className="h-3.5 w-3.5" strokeWidth={2.4} />
                          Ajouter « {form.owner.trim()} » comme nouveau client
                        </button>
                      )}

                      {filteredOwners.length === 0 && form.owner.trim() === "" && (
                        <div className="px-2.5 py-2 text-sm text-muted-foreground">Aucun client</div>
                      )}
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Caractéristiques */}
              <div className="flex flex-col gap-4 rounded-xl border border-border bg-muted p-5">
                <SectionLabel icon={Calendar03Icon} title="Caractéristiques" hint="Apparence, âge et poids" />

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="animal-coat">Robe / Couleur</Label>
                  <Input
                    id="animal-coat"
                    value={form.coat}
                    onChange={(e) => setForm((f) => ({ ...f, coat: e.target.value }))}
                    placeholder="Ex: Blanc crème"
                    className="h-11 bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="animal-birthdate">Date de naissance</Label>
                    <Input
                      id="animal-birthdate"
                      type="date"
                      value={form.birthDate}
                      onChange={(e) => setForm((f) => ({ ...f, birthDate: e.target.value }))}
                      className="h-11 bg-white"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="animal-weight">Poids (kg)</Label>
                    <Input
                      id="animal-weight"
                      type="number"
                      step="0.1"
                      min="0"
                      value={form.weightKg}
                      onChange={(e) => setForm((f) => ({ ...f, weightKg: e.target.value }))}
                      placeholder="Ex: 4.2"
                      className="h-11 bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="flex flex-col gap-6">
              {/* Santé */}
              <div className="flex flex-col gap-4 rounded-xl border border-border bg-muted p-5">
                <SectionLabel icon={StethoscopeIcon} title="Santé" hint="Statut médical et antécédents" />

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, vaccinated: !f.vaccinated }))}
                    className={cn(
                      "flex flex-1 items-center gap-2 rounded-lg border px-3.5 py-3 text-sm font-medium transition-all",
                      form.vaccinated
                        ? "border-status-info/40 bg-status-info-bg text-status-info"
                        : "border-border bg-card text-muted-foreground hover:border-border/60",
                    )}
                  >
                    <HugeiconsIcon icon={VaccineIcon} className="h-4 w-4" strokeWidth={2.2} />
                    Vacciné
                    {form.vaccinated && (
                      <HugeiconsIcon icon={CheckmarkCircle02Icon} className="ml-auto h-4 w-4" strokeWidth={2.2} />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, sterilized: !f.sterilized }))}
                    className={cn(
                      "flex flex-1 items-center gap-2 rounded-lg border px-3.5 py-3 text-sm font-medium transition-all",
                      form.sterilized
                        ? "border-status-warning/40 bg-status-warning-bg text-status-warning"
                        : "border-border bg-card text-muted-foreground hover:border-border/60",
                    )}
                  >
                    <HugeiconsIcon icon={Scissor01Icon} className="h-4 w-4" strokeWidth={2.2} />
                    Stérilisé
                    {form.sterilized && (
                      <HugeiconsIcon icon={CheckmarkCircle02Icon} className="ml-auto h-4 w-4" strokeWidth={2.2} />
                    )}
                  </button>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="animal-allergies">Allergies connues</Label>
                  <Textarea
                    id="animal-allergies"
                    value={form.allergies}
                    onChange={(e) => setForm((f) => ({ ...f, allergies: e.target.value }))}
                    placeholder="Ex: Pénicilline, herbe Timothy..."
                    className="min-h-20 bg-white"
                  />
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-medium text-muted-foreground">Suggestions rapides</span>
                    <SuggestionChips
                      items={ALLERGY_SUGGESTIONS}
                      value={form.allergies}
                      onToggle={(item) => setForm((f) => ({ ...f, allergies: toggleListValue(f.allergies, item) }))}
                      activeClass="border-status-info/40 bg-status-info-bg text-status-info"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="animal-history">Antécédents médicaux</Label>
                  <Textarea
                    id="animal-history"
                    value={form.history}
                    onChange={(e) => setForm((f) => ({ ...f, history: e.target.value }))}
                    placeholder="Historique médical, chirurgies, maladies chroniques..."
                    className="min-h-20 bg-white"
                  />
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-medium text-muted-foreground">Suggestions rapides</span>
                    <SuggestionChips
                      items={HISTORY_SUGGESTIONS}
                      value={form.history}
                      onToggle={(item) => setForm((f) => ({ ...f, history: toggleListValue(f.history, item) }))}
                      activeClass="border-status-warning/40 bg-status-warning-bg text-status-warning"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" size="lg" onClick={() => setOpen(false)}>
                  Annuler
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  disabled={!canSubmit}
                  className="gap-1.5 bg-primary hover:bg-primary/90"
                >
                  <HugeiconsIcon icon={FloppyDiskIcon} className="h-4 w-4" strokeWidth={2.2} />
                  Enregistrer l&apos;animal
                </Button>
              </div>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>

    <AddClientDialog
      open={addClientOpen}
      onOpenChange={setAddClientOpen}
      hideTrigger
      initialName={form.owner.trim()}
      onAdd={(client) => {
        onAddClient(client);
        setForm((f) => ({ ...f, owner: client.name }));
        setAddClientOpen(false);
      }}
    />
    </>
  );
}
