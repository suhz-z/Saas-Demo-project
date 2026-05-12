"use client";

import { useState } from "react";
import { Search, Trash2, Shield, User, Power, PowerOff } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { deleteUser, updateUserStatus } from "@/services/user";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/shared/Pagination";

type UserRow = {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "COUNSELOR";
  isActive: boolean;
  createdAt: Date | string;
};

type UserTableProps = {
  data: UserRow[];
  total: number;
  page: number;
  totalPages: number;
  query: string;
  children?: React.ReactNode;
};

export function UserTable({ data, total, page, totalPages, query, children }: UserTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState(query);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/admin/users?q=${encodeURIComponent(search)}&page=1`);
  };

  const handleStatusChange = async (id: string, isActive: boolean) => {
    await updateUserStatus(id, isActive);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Deactivate this user account?")) {
      await deleteUser(id);
    }
  };

  return (
    <div className="space-y-6 mt-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <form onSubmit={handleSearch} className="relative w-full max-w-sm group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 rounded-xl text-[13px] text-white/70 placeholder:text-white/25 border-[oklch(0.26_0.04_272_/_0.6)] bg-[oklch(0.09_0.018_272_/_0.7)] focus-visible:border-[oklch(0.68_0.22_290_/_0.45)] focus-visible:ring-[oklch(0.68_0.22_290_/_0.12)] focus-visible:ring-3"
          />
        </form>
        <div className="flex gap-2">
          {children}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden relative" style={{ background: "linear-gradient(145deg, oklch(0.11 0.022 272 / 0.75), oklch(0.09 0.018 275 / 0.65))", border: "1px solid oklch(0.24 0.035 272 / 0.65)", backdropFilter: "blur(20px)", boxShadow: "0 4px 24px oklch(0 0 0 / 0.25), inset 0 1px 0 oklch(1 0 0 / 0.03)" }}>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-border/40">
              <TableHead className="py-3 text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Name</TableHead>
              <TableHead className="py-3 text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Email</TableHead>
              <TableHead className="py-3 text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Role</TableHead>
              <TableHead className="py-3 text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Status</TableHead>
              <TableHead className="py-3 text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Created</TableHead>
              <TableHead className="py-3 text-[12px] font-semibold text-muted-foreground uppercase tracking-wider text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="popLayout">
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-16">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Search size={32} className="opacity-15" />
                      <p className="text-[14px] font-medium">No users found</p>
                      <p className="text-[12px]">Try adjusting your search terms</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                data.map((user, idx) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.03 }}
                    className="group hover:bg-muted/30 border-b border-border/30 transition-colors"
                  >
                    <TableCell className="py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/8 flex items-center justify-center text-[11px] font-bold text-primary shrink-0">
                          {user.role === "ADMIN" ? <Shield size={14} /> : <User size={14} />}
                        </div>
                        <span className="text-[13px] font-semibold text-foreground">
                          {user.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3.5">
                      <span className="text-[13px] font-medium text-muted-foreground">{user.email}</span>
                    </TableCell>
                    <TableCell className="py-3.5">
                      <Badge variant="outline" className={`text-[10px] font-semibold tracking-wider ${user.role === "ADMIN" ? "border-primary/20 text-primary bg-primary/5" : "text-muted-foreground"}`}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3.5">
                      <button
                        type="button"
                        onClick={() => handleStatusChange(user.id, !user.isActive)}
                        className={`px-2 py-0.5 rounded-full text-[11px] font-semibold transition-colors ${
                          user.isActive 
                            ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20" 
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </button>
                    </TableCell>
                    <TableCell className="py-3.5">
                      <span className="text-[12px] text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </TableCell>
                    <TableCell className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className={`h-8 w-8 rounded-lg ${user.isActive ? "hover:text-amber-600 hover:bg-amber-500/10" : "hover:text-emerald-600 hover:bg-emerald-500/10"}`}
                          onClick={() => handleStatusChange(user.id, !user.isActive)}
                          title={user.isActive ? "Deactivate User" : "Activate User"}
                        >
                          {user.isActive ? <PowerOff size={15} /> : <Power size={15} />}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-lg hover:bg-destructive/8 hover:text-destructive" 
                          onClick={() => handleDelete(user.id)}
                          title="Delete User"
                        >
                          <Trash2 size={15} />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-[13px] text-muted-foreground">
          {data.length} of {total} users
        </span>
        <Pagination page={page} totalPages={totalPages} baseUrl="/admin/users" />
      </div>
    </div>
  );
}
