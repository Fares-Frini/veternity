"use client";

import type { ReactNode } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { GridViewIcon, ListViewIcon, Search01Icon } from "@hugeicons/core-free-icons";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import type { Animal } from "./data";
import { AnimauxTable } from "./animaux-table";
import { AnimauxGrid } from "./animaux-grid";
import { getPageNumbers } from "./utils";

export type AnimauxView = "list" | "grid";

const PAGE_SIZE_OPTIONS = [5, 10, 20];

interface AnimauxCardProps {
  search: string;
  onSearchChange: (value: string) => void;
  view: AnimauxView;
  onViewChange: (view: AnimauxView) => void;
  animals: Animal[];
  pageAnimals: Animal[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  rangeStart: number;
  rangeEnd: number;
  headerAction?: ReactNode;
}

export function AnimauxCard({
  search,
  onSearchChange,
  view,
  onViewChange,
  animals,
  pageAnimals,
  page,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  rangeStart,
  rangeEnd,
  headerAction,
}: AnimauxCardProps) {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border p-4">
        <div className="relative w-full max-w-sm">
          <HugeiconsIcon
            icon={Search01Icon}
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            strokeWidth={2}
          />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Rechercher un animal, un propriétaire..."
            className="h-10 rounded-full border-border bg-muted pl-9 text-sm"
          />
        </div>

        <div className="flex items-center gap-3">
          <ToggleGroup
            type="single"
            value={view}
            onValueChange={(value) => value && onViewChange(value as AnimauxView)}
            variant="outline"
            spacing={0}
            className="relative rounded-md border-border bg-muted p-1"
          >
            <span
              aria-hidden
              className={`pointer-events-none absolute top-1 bottom-1 left-1 z-0 w-[calc(50%-4px)] rounded-sm bg-primary shadow-[inset_0_2px_4px_rgba(0,0,0,0.25),inset_0_-1px_1px_rgba(255,255,255,0.35)] transition-transform duration-300 ease-out ${
                view === "grid" ? "translate-x-full" : "translate-x-0"
              }`}
            />
            <ToggleGroupItem
              value="list"
              aria-label="Vue liste"
              className="relative z-10 border-transparent bg-transparent data-[state=on]:bg-transparent data-[state=on]:text-primary-foreground"
            >
              <HugeiconsIcon icon={ListViewIcon} className="h-4 w-4" strokeWidth={2.2} />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="grid"
              aria-label="Vue grille"
              className="relative z-10 border-transparent bg-transparent data-[state=on]:bg-transparent data-[state=on]:text-primary-foreground"
            >
              <HugeiconsIcon icon={GridViewIcon} className="h-4 w-4" strokeWidth={2.2} />
            </ToggleGroupItem>
          </ToggleGroup>

          {headerAction}
        </div>
      </div>

      {view === "list" ? <AnimauxTable animals={pageAnimals} /> : <div className="p-4"><AnimauxGrid animals={pageAnimals} /></div>}

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border px-4 py-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Lignes par page</span>
          <Select value={String(pageSize)} onValueChange={(value) => onPageSizeChange(Number(value))}>
            <SelectTrigger className="h-8 w-[70px] border-border text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZE_OPTIONS.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="hidden sm:inline">
            {animals.length === 0 ? "0" : `${rangeStart}–${rangeEnd}`} sur {animals.length}
          </span>
        </div>

        <Pagination className="mx-0 w-auto">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page > 1) onPageChange(page - 1);
                }}
                className={page <= 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {getPageNumbers(page, totalPages).map((pageNumber, i) =>
              pageNumber === null ? (
                <PaginationItem key={`ellipsis-${i}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    href="#"
                    isActive={pageNumber === page}
                    onClick={(e) => {
                      e.preventDefault();
                      onPageChange(pageNumber);
                    }}
                    className={pageNumber === page ? "border-primary text-primary" : ""}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              )
            )}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page < totalPages) onPageChange(page + 1);
                }}
                className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
