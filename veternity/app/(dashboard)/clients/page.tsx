"use client";

import { useMemo, useState } from "react";
import { ClientsCard } from "./_components/clients-card";
import { AddClientDialog } from "./_components/add-client-dialog";
import { CLIENTS, type Client } from "./_components/data";

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>(CLIENTS);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredClients = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return clients;
    return clients.filter((client) =>
      [client.id, client.name, client.email, client.phone, client.address]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [clients, search]);

  const totalPages = Math.max(1, Math.ceil(filteredClients.length / pageSize));

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPage(1);
  };

  const handleAddClient = (client: Client) => {
    setClients((prev) => [client, ...prev]);
    setSearch("");
    setPage(1);
  };

  const rangeStart = (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, filteredClients.length);
  const pageClients = filteredClients.slice(rangeStart - 1, rangeEnd);

  return (
    <div className="flex flex-col gap-6">
      <ClientsCard
        search={search}
        onSearchChange={handleSearchChange}
        clients={filteredClients}
        pageClients={pageClients}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
        rangeStart={rangeStart}
        rangeEnd={rangeEnd}
        headerAction={<AddClientDialog onAdd={handleAddClient} />}
      />
    </div>
  );
}
