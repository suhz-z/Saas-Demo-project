"use client";

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
      pages.push(1);
      if (page > 3) pages.push("...");
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }
      if (page < totalPages - 2) pages.push("...");
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  const btnBase: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    height: "2rem",
    borderRadius: "0.625rem",
    fontSize: "12px",
    fontWeight: 500,
    transition: "all 0.15s",
    cursor: "pointer",
    border: "1px solid oklch(0.26 0.04 272 / 0.7)",
    background: "oklch(0.10 0.020 272 / 0.7)",
    color: "oklch(0.60 0.025 268)",
    backdropFilter: "blur(8px)",
  };

  const btnActive: React.CSSProperties = {
    ...btnBase,
    background: "linear-gradient(135deg, oklch(0.65 0.22 290), oklch(0.58 0.22 260))",
    border: "1px solid oklch(0.68 0.22 290 / 0.5)",
    color: "white",
    boxShadow: "0 0 14px oklch(0.68 0.22 290 / 0.3)",
  };

  const btnDisabled: React.CSSProperties = {
    ...btnBase,
    opacity: 0.35,
    cursor: "not-allowed",
  };

  return (
    <div className="flex items-center gap-1">
      <button
        style={page <= 1 ? btnDisabled : btnBase}
        disabled={page <= 1}
        onClick={() => handlePageChange(page - 1)}
        className="px-3 gap-1 flex items-center"
        onMouseEnter={(e) => {
          if (page > 1) {
            (e.currentTarget as HTMLButtonElement).style.background = "oklch(0.68 0.22 290 / 0.12)";
            (e.currentTarget as HTMLButtonElement).style.color = "oklch(0.78 0.15 290)";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "oklch(0.68 0.22 290 / 0.35)";
          }
        }}
        onMouseLeave={(e) => {
          if (page > 1) {
            (e.currentTarget as HTMLButtonElement).style.background = "oklch(0.10 0.020 272 / 0.7)";
            (e.currentTarget as HTMLButtonElement).style.color = "oklch(0.60 0.025 268)";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "oklch(0.26 0.04 272 / 0.7)";
          }
        }}
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        Previous
      </button>

      {getPages().map((p, i) =>
        typeof p === "number" ? (
          <button
            key={i}
            style={page === p ? btnActive : btnBase}
            onClick={() => handlePageChange(p)}
            className="w-8"
            onMouseEnter={(e) => {
              if (page !== p) {
                (e.currentTarget as HTMLButtonElement).style.background = "oklch(0.68 0.22 290 / 0.12)";
                (e.currentTarget as HTMLButtonElement).style.color = "oklch(0.78 0.15 290)";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "oklch(0.68 0.22 290 / 0.35)";
              }
            }}
            onMouseLeave={(e) => {
              if (page !== p) {
                (e.currentTarget as HTMLButtonElement).style.background = "oklch(0.10 0.020 272 / 0.7)";
                (e.currentTarget as HTMLButtonElement).style.color = "oklch(0.60 0.025 268)";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "oklch(0.26 0.04 272 / 0.7)";
              }
            }}
          >
            {p}
          </button>
        ) : (
          <div key={i} className="flex h-8 w-8 items-center justify-center">
            <MoreHorizontal className="h-4 w-4" style={{ color: "oklch(0.40 0.025 268)" }} />
          </div>
        )
      )}

      <button
        style={page >= totalPages ? btnDisabled : btnBase}
        disabled={page >= totalPages}
        onClick={() => handlePageChange(page + 1)}
        className="px-3 gap-1 flex items-center"
        onMouseEnter={(e) => {
          if (page < totalPages) {
            (e.currentTarget as HTMLButtonElement).style.background = "oklch(0.68 0.22 290 / 0.12)";
            (e.currentTarget as HTMLButtonElement).style.color = "oklch(0.78 0.15 290)";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "oklch(0.68 0.22 290 / 0.35)";
          }
        }}
        onMouseLeave={(e) => {
          if (page < totalPages) {
            (e.currentTarget as HTMLButtonElement).style.background = "oklch(0.10 0.020 272 / 0.7)";
            (e.currentTarget as HTMLButtonElement).style.color = "oklch(0.60 0.025 268)";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "oklch(0.26 0.04 272 / 0.7)";
          }
        }}
      >
        Next
        <ChevronRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
