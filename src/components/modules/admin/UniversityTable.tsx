"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Trash2, ExternalLink, Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteUniversity } from "@/services/university";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export function UniversityTable({ data, total, page, totalPages, query }: any) {
  const router = useRouter();
  const [search, setSearch] = useState(query);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/admin/universities?q=${encodeURIComponent(search)}&page=1`);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this university?")) {
      await deleteUniversity(id);
    }
  };

  return (
    <div className="space-y-6 mt-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <form onSubmit={handleSearch} className="relative w-full max-w-sm group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search universities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 bg-white dark:bg-card border-border/50 focus-visible:ring-primary/20 rounded-lg text-[13px]"
          />
        </form>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-card rounded-xl border border-border/50 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-border/40">
              <TableHead className="py-3 text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Name</TableHead>
              <TableHead className="py-3 text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Location</TableHead>
              <TableHead className="py-3 text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Ranking</TableHead>
              <TableHead className="py-3 text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Partner</TableHead>
              <TableHead className="py-3 text-[12px] font-semibold text-muted-foreground uppercase tracking-wider text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="popLayout">
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-16">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Search size={32} className="opacity-15" />
                      <p className="text-[14px] font-medium">No universities found</p>
                      <p className="text-[12px]">Try adjusting your search terms</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : data.map((uni: any, idx: number) => (
                <motion.tr
                  key={uni.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.03 }}
                  className="group hover:bg-muted/30 border-b border-border/30 transition-colors"
                >
                  <TableCell className="py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/8 flex items-center justify-center text-[11px] font-bold text-primary shrink-0">
                        <Globe size={14} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[13px] font-semibold text-foreground flex items-center gap-1.5">
                          {uni.name}
                          {uni.website && (
                            <a href={uni.website} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                              <ExternalLink size={12} />
                            </a>
                          )}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3.5">
                    <span className="text-[13px] font-medium text-foreground/80">{uni.city}, {uni.country?.name}</span>
                  </TableCell>
                  <TableCell className="py-3.5">
                    <span className="text-[13px] font-medium text-foreground/80">{uni.ranking || "—"}</span>
                  </TableCell>
                  <TableCell className="py-3.5">
                    {uni.partnerStatus ? (
                      <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[11px] font-semibold">
                        Yes
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[11px] font-semibold text-muted-foreground">
                        No
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="py-3.5 text-right">
                    <div className="flex items-center justify-end gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-destructive/8 hover:text-destructive" onClick={() => handleDelete(uni.id)}>
                        <Trash2 size={15} />
                      </Button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <span className="text-[13px] text-muted-foreground">
          {data.length} of {total} universities
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => router.push(`/admin/universities?q=${query}&page=${page - 1}`)}
            className="h-8 rounded-lg text-[12px] px-3"
          >
            Previous
          </Button>
          {[...Array(totalPages)].map((_, i) => (
            <Button
              key={i}
              variant={page === i + 1 ? "default" : "ghost"}
              size="sm"
              className={`h-8 w-8 rounded-lg text-[12px] ${page === i + 1 ? "shadow-sm" : ""}`}
              onClick={() => router.push(`/admin/universities?q=${query}&page=${i + 1}`)}
            >
              {i + 1}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => router.push(`/admin/universities?q=${query}&page=${page + 1}`)}
            className="h-8 rounded-lg text-[12px] px-3"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
