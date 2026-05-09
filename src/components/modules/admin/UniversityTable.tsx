"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Trash2, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteUniversity } from "@/services/university";

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
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2 w-full max-w-md">
        <Input 
          placeholder="Search universities..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
        />
        <Button type="submit" variant="secondary"><Search size={16} className="mr-2"/> Search</Button>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Ranking</TableHead>
            <TableHead>Partner</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-gray-500">No universities found</TableCell>
            </TableRow>
          ) : data.map((uni: any) => (
            <TableRow key={uni.id}>
              <TableCell className="font-medium">
                {uni.name}
                {uni.website && (
                  <a href={uni.website} target="_blank" rel="noreferrer" className="ml-2 text-emerald-600 inline-flex items-center">
                    <ExternalLink size={12} />
                  </a>
                )}
              </TableCell>
              <TableCell>{uni.city}, {uni.country?.name}</TableCell>
              <TableCell>{uni.ranking || "-"}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${uni.partnerStatus ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'}`}>
                  {uni.partnerStatus ? 'Yes' : 'No'}
                </span>
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button variant="ghost" size="sm" onClick={() => handleDelete(uni.id)}>
                  <Trash2 size={16} className="text-red-500" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Basic Pagination */}
      <div className="flex items-center justify-between pt-4 border-t">
        <span className="text-sm text-gray-500">Showing {data.length} of {total} results</span>
        <div className="space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            disabled={page <= 1}
            onClick={() => router.push(`/admin/universities?q=${query}&page=${page - 1}`)}
          >
            Previous
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            disabled={page >= totalPages}
            onClick={() => router.push(`/admin/universities?q=${query}&page=${page + 1}`)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
