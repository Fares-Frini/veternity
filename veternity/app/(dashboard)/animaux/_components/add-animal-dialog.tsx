"use client";

import { useId, useState, type FormEvent } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  BirdIcon,
  CameraAdd01Icon,
  CarrotIcon,
  CatIcon,
  EggIcon,
  FemaleSymbolIcon,
  FloppyDiskIcon,
  FootprintsIcon,
  MaleSymbolIcon,
  NutIcon,
  PlusSignIcon,
  Scissor01Icon,
  Search01Icon,
  VaccineIcon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { Animal } from "./data";

const ESPECE_OPTIONS = [
  { value: "Chat", icon: CatIcon },
  { value: "Chien", icon: FootprintsIcon },
  { value: "Lapin", icon: CarrotIcon },
  { value: "Oiseau", icon: BirdIcon },
  { value: "Rongeur", icon: NutIcon },
  { value: "Reptile", icon: EggIcon },
] as const;

const SEXE_OPTIONS = [
  { value: "M" as const, label: "Mâle", icon: MaleSymbolIcon },
  { value: "F" as const, label: "Femelle", icon: FemaleSymbolIcon },
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

interface AddAnimalDialogProps {
  owners: string[];
  onAdd: (animal: Animal) => void;
}

export function AddAnimalDialog({ owners, onAdd }: AddAnimalDialogProps) {
  const ownersListId = useId();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

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
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setForm(EMPTY_FORM);
      }}
    >
      <DialogTrigger asChild>
        <Button className="gap-1.5 bg-[#00998e] hover:bg-[#00877d]">
          <HugeiconsIcon icon={PlusSignIcon} className="h-4 w-4" strokeWidth={2.4} />
          Ajouter
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Ajouter un animal</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Photo */}
          <div className="flex justify-center">
            <button
              type="button"
              className="relative flex h-20 w-20 items-center justify-center rounded-full border border-dashed border-[#dfe3f0] bg-[#f7f8fc] text-[#a3ade0] transition-colors hover:border-[#00998e] hover:text-[#00998e]"
            >
              <HugeiconsIcon icon={FootprintsIcon} className="h-8 w-8" strokeWidth={2} />
              <span className="absolute right-0 bottom-0 flex h-6 w-6 items-center justify-center rounded-full bg-[#00998e] text-white ring-2 ring-white">
                <HugeiconsIcon icon={CameraAdd01Icon} className="h-3.5 w-3.5" strokeWidth={2.4} />
              </span>
            </button>
          </div>

          {/* Nom */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="animal-name">Nom de l&apos;animal *</Label>
            <Input
              id="animal-name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Ex: Luna"
              required
            />
          </div>

          {/* Espèce */}
          <div className="flex flex-col gap-1.5">
            <Label>Espèce *</Label>
            <ToggleGroup
              type="single"
              value={form.species}
              onValueChange={(value) => value && setForm((f) => ({ ...f, species: value }))}
              variant="outline"
              className="grid w-full grid-cols-3 gap-2"
            >
              {ESPECE_OPTIONS.map(({ value, icon }) => (
                <ToggleGroupItem
                  key={value}
                  value={value}
                  className="flex h-16 flex-col gap-1 rounded-lg data-[state=on]:border-[#00998e] data-[state=on]:bg-[#e3f5f2] data-[state=on]:text-[#00998e]"
                >
                  <HugeiconsIcon icon={icon} className="h-5 w-5" strokeWidth={2} />
                  <span className="text-xs font-medium">{value}</span>
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          {/* Race */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="animal-breed">Race</Label>
            <Input
              id="animal-breed"
              value={form.breed}
              onChange={(e) => setForm((f) => ({ ...f, breed: e.target.value }))}
              placeholder="Ex: Persan"
            />
          </div>

          {/* Sexe */}
          <div className="flex flex-col gap-1.5">
            <Label>Sexe *</Label>
            <ToggleGroup
              type="single"
              value={form.sex}
              onValueChange={(value) => value && setForm((f) => ({ ...f, sex: value as "M" | "F" }))}
              variant="outline"
              className="grid w-full grid-cols-2 gap-2"
            >
              {SEXE_OPTIONS.map(({ value, label, icon }) => (
                <ToggleGroupItem
                  key={value}
                  value={value}
                  className="flex h-10 gap-1.5 rounded-lg data-[state=on]:border-[#00998e] data-[state=on]:bg-[#e3f5f2] data-[state=on]:text-[#00998e]"
                >
                  <HugeiconsIcon icon={icon} className="h-4 w-4" strokeWidth={2.2} />
                  {label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          {/* Robe */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="animal-coat">Robe / Couleur</Label>
            <Input
              id="animal-coat"
              value={form.coat}
              onChange={(e) => setForm((f) => ({ ...f, coat: e.target.value }))}
              placeholder="Ex: Blanc crème"
            />
          </div>

          {/* Naissance + poids */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="animal-birthdate">Date de naissance</Label>
              <Input
                id="animal-birthdate"
                type="date"
                value={form.birthDate}
                onChange={(e) => setForm((f) => ({ ...f, birthDate: e.target.value }))}
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
              />
            </div>
          </div>

          {/* Propriétaire */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="animal-owner">Propriétaire</Label>
            <div className="relative">
              <HugeiconsIcon
                icon={Search01Icon}
                className="pointer-events-none absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-[#a3ade0]"
                strokeWidth={2}
              />
              <Input
                id="animal-owner"
                list={ownersListId}
                value={form.owner}
                onChange={(e) => setForm((f) => ({ ...f, owner: e.target.value }))}
                placeholder="Rechercher un client..."
                className="pl-8"
              />
              <datalist id={ownersListId}>
                {owners.map((owner) => (
                  <option key={owner} value={owner} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Vacciné / Stérilisé */}
          <div className="flex flex-wrap gap-5">
            <label className="flex items-center gap-2 text-sm font-medium text-[#1e2a4a]">
              <Checkbox
                checked={form.vaccinated}
                onCheckedChange={(checked) => setForm((f) => ({ ...f, vaccinated: checked === true }))}
              />
              <HugeiconsIcon icon={VaccineIcon} className="h-4 w-4 text-[#3b82f6]" strokeWidth={2.2} />
              Vacciné
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-[#1e2a4a]">
              <Checkbox
                checked={form.sterilized}
                onCheckedChange={(checked) => setForm((f) => ({ ...f, sterilized: checked === true }))}
              />
              <HugeiconsIcon icon={Scissor01Icon} className="h-4 w-4 text-[#f5920a]" strokeWidth={2.2} />
              Stérilisé
            </label>
          </div>

          {/* Allergies */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="animal-allergies">Allergies connues</Label>
            <Textarea
              id="animal-allergies"
              value={form.allergies}
              onChange={(e) => setForm((f) => ({ ...f, allergies: e.target.value }))}
              placeholder="Ex: Pénicilline, herbe Timothy..."
              className="min-h-16"
            />
          </div>

          {/* Antécédents */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="animal-history">Antécédents médicaux</Label>
            <Textarea
              id="animal-history"
              value={form.history}
              onChange={(e) => setForm((f) => ({ ...f, history: e.target.value }))}
              placeholder="Historique médical, chirurgies, maladies chroniques..."
              className="min-h-20"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={!canSubmit} className="gap-1.5 bg-[#00998e] hover:bg-[#00877d]">
              <HugeiconsIcon icon={FloppyDiskIcon} className="h-4 w-4" strokeWidth={2.2} />
              Enregistrer l&apos;animal
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
