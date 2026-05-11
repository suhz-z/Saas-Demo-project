"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
  page: number;
  totalPages: number;
  baseUrl: string;
}

export function Pagination({ page, totalPages, baseUrl }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", p.toString());
    router.push(`${baseUrl}?${params.toString()}`);
  };

  const getPages = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // Always show page 1
      pages.push(1);

      if (page > 3) {
        pages.push("...");
      }

      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }

      if (page < totalPages - 2) {
        pages.push("...");
      }

      // Always show last page
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="outline"
        size="sm"
        disabled={page <= 1}
        onClick={() => handlePageChange(page - 1)}
        className="h-8 rounded-lg text-[12px] px-3"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Previous
      </Button>
      {getPages().map((p, i) => (
        typeof p === "number" ? (
          <Button
            key={i}
            variant={page === p ? "default" : "ghost"}
            size="sm"
            className={`h-8 w-8 rounded-lg text-[12px] ${page === p ? "shadow-sm" : ""}`}
            onClick={() => handlePageChange(p)}
          >
            {p}
          </Button>
        ) : (
          <div key={i} className="flex h-8 w-8 items-center justify-center">
            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
          </div>
        )
      ))}
      <Button
        variant="outline"
        size="sm"
        disabled={page >= totalPages}
        onClick={() => handlePageChange(page + 1)}
        className="h-8 rounded-lg text-[12px] px-3"
      >
        Next
        <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
}
