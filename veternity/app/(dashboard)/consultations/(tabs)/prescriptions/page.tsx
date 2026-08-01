"use client";

import { useMemo, useState } from "react";
import { PrescriptionsCard } from "./_components/prescriptions-card";
import { AddPrescriptionDialog } from "./_components/add-prescription-dialog";
import { PRESCRIPTIONS, type Prescription } from "./_components/data";

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(PRESCRIPTIONS);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredPrescriptions = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return prescriptions;
    return prescriptions.filter((p) =>
      [p.id, p.animal, p.owner, p.medications, p.posology, p.vet].join(" ").toLowerCase().includes(query)
    );
  }, [prescriptions, search]);

  const totalPages = Math.max(1, Math.ceil(filteredPrescriptions.length / pageSize));

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPage(1);
  };

  const handleAddPrescription = (prescription: Prescription) => {
    setPrescriptions((prev) => [prescription, ...prev]);
    setSearch("");
    setPage(1);
  };

  const rangeStart = (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, filteredPrescriptions.length);
  const pagePrescriptions = filteredPrescriptions.slice(rangeStart - 1, rangeEnd);

  return (
    <PrescriptionsCard
      search={search}
      onSearchChange={handleSearchChange}
      prescriptions={filteredPrescriptions}
      pagePrescriptions={pagePrescriptions}
      page={page}
      totalPages={totalPages}
      onPageChange={setPage}
      pageSize={pageSize}
      onPageSizeChange={handlePageSizeChange}
      rangeStart={rangeStart}
      rangeEnd={rangeEnd}
      headerAction={<AddPrescriptionDialog onAdd={handleAddPrescription} />}
    />
  );
}
