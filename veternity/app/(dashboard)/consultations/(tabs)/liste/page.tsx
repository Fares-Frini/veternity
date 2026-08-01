"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { ConsultationsCard } from "./_components/consultations-card";
import { CONSULTATIONS, type Consultation } from "./_components/data";

export default function ConsultationsListePage() {
  const [consultations] = useState<Consultation[]>(CONSULTATIONS);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredConsultations = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return consultations;
    return consultations.filter((c) =>
      [c.id, c.animal, c.owner, c.vet, c.diagnostic, c.status].join(" ").toLowerCase().includes(query)
    );
  }, [consultations, search]);

  const totalPages = Math.max(1, Math.ceil(filteredConsultations.length / pageSize));

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPage(1);
  };

  const rangeStart = (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, filteredConsultations.length);
  const pageConsultations = filteredConsultations.slice(rangeStart - 1, rangeEnd);

  return (
    <ConsultationsCard
      search={search}
      onSearchChange={handleSearchChange}
      consultations={filteredConsultations}
      pageConsultations={pageConsultations}
      page={page}
      totalPages={totalPages}
      onPageChange={setPage}
      pageSize={pageSize}
      onPageSizeChange={handlePageSizeChange}
      rangeStart={rangeStart}
      rangeEnd={rangeEnd}
      headerAction={
        <Button asChild className="gap-1.5 bg-primary hover:bg-primary/90">
          <Link href="/consultations/nouvelle">
            <HugeiconsIcon icon={PlusSignIcon} className="h-4 w-4" strokeWidth={2.4} />
            Nouvelle consultation
          </Link>
        </Button>
      }
    />
  );
}
