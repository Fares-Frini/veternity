"use client";

import { useMemo, useState } from "react";
import { AnimauxStats } from "./_components/animaux-stats";
import { AnimauxCard, type AnimauxView } from "./_components/animaux-card";
import { AddAnimalDialog } from "./_components/add-animal-dialog";
import { ANIMALS, type Animal } from "./_components/data";

export default function AnimauxPage() {
  const [animals, setAnimals] = useState<Animal[]>(ANIMALS);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<AnimauxView>("list");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const owners = useMemo(
    () => [...new Set(animals.map((animal) => animal.owner))].sort(),
    [animals]
  );

  const filteredAnimals = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return animals;
    return animals.filter((animal) =>
      [animal.id, animal.name, animal.species, animal.breed, animal.owner]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [animals, search]);

  const totalPages = Math.max(1, Math.ceil(filteredAnimals.length / pageSize));

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPage(1);
  };

  const handleAddAnimal = (animal: Animal) => {
    setAnimals((prev) => [animal, ...prev]);
    setSearch("");
    setPage(1);
  };

  const rangeStart = (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, filteredAnimals.length);
  const pageAnimals = filteredAnimals.slice(rangeStart - 1, rangeEnd);

  return (
    <div className="flex flex-col gap-6">
      <AnimauxStats />
      <AnimauxCard
        search={search}
        onSearchChange={handleSearchChange}
        view={view}
        onViewChange={setView}
        animals={filteredAnimals}
        pageAnimals={pageAnimals}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
        rangeStart={rangeStart}
        rangeEnd={rangeEnd}
        headerAction={<AddAnimalDialog owners={owners} onAdd={handleAddAnimal} />}
      />
    </div>
  );
}
