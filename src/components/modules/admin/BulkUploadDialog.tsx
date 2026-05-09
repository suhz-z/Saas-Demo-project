"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UploadCloud, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import Papa from "papaparse";

export function BulkUploadDialog({ type, onUpload }: { type: "Universities" | "Courses", onUpload: (data: any[]) => Promise<any> }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const uploadResult = await onUpload(results.data);
          setResult(uploadResult);
          
          // Show results for 3 seconds, then close
          if (uploadResult.success) {
            setTimeout(() => {
              setOpen(false);
              setResult(null);
            }, 2000);
          }
        } catch (err) {
          console.error(err);
          setResult({
            success: false,
            message: err instanceof Error ? err.message : "Failed to upload bulk records.",
            errors: [],
          });
        } finally {
          setLoading(false);
        }
      },
      error: (err) => {
        console.error(err);
        setResult({
          success: false,
          message: "Failed to parse CSV file. Please check the format.",
          errors: [],
        });
        setLoading(false);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen);
      if (!newOpen) setResult(null);
    }}>
      <DialogTrigger
        render={
          <Button variant="outline" className="text-emerald-700 border-emerald-200 hover:bg-emerald-50" />
        }
      >
        <UploadCloud size={16} className="mr-2" /> Bulk Upload
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Bulk Upload {type}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {!result ? (
            <>
              <p className="text-sm text-gray-500">
                Upload a CSV file containing your {type.toLowerCase()}. 
              </p>
              <div className="text-xs text-gray-400 bg-gray-50 p-3 rounded">
                <p className="font-semibold mb-1">Required CSV Headers:</p>
                <p>
                  {type === "Universities" 
                    ? "name, countryName, city, ranking (optional), website (optional), partnerStatus (optional)"
                    : "name, universityId, studyLevel, domainName, degreeType (optional), duration (optional), tuitionFees, currency (optional), intake (optional), description (optional)"
                  }
                </p>
              </div>
              <div className="border-2 border-dashed border-emerald-200 rounded-lg p-6 flex flex-col items-center justify-center bg-emerald-50/50">
                {loading ? (
                  <Loader2 className="h-8 w-8 text-emerald-600 animate-spin" />
                ) : (
                  <>
                    <UploadCloud className="h-8 w-8 text-emerald-600 mb-2" />
                    <input 
                      type="file" 
                      accept=".csv,.xlsx" 
                      onChange={handleFileUpload}
                      aria-label="Upload CSV file"
                      title="Upload CSV file"
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 cursor-pointer" 
                    />
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <div className={`p-4 rounded-lg flex items-start gap-3 ${result.success ? "bg-emerald-50 border border-emerald-200" : "bg-red-50 border border-red-200"}`}>
                {result.success ? (
                  <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className={`font-semibold ${result.success ? "text-emerald-900" : "text-red-900"}`}>
                    {result.message}
                  </p>
                </div>
              </div>

              {result.created > 0 && (
                <div className="text-sm">
                  <p className="text-emerald-700 font-medium">✓ Created: {result.created} records</p>
                </div>
              )}

              {result.skipped > 0 && (
                <div className="text-sm">
                  <p className="text-yellow-700 font-medium mb-2">⚠ Skipped: {result.skipped} records</p>
                  {result.skippedRecords && result.skippedRecords.length > 0 && (
                    <ul className="list-disc pl-5 text-yellow-600 text-xs space-y-1">
                      {result.skippedRecords.slice(0, 5).map((s: any, i: number) => (
                        <li key={i}>Row {s.row}: {s.reason}</li>
                      ))}
                      {result.skippedRecords.length > 5 && (
                        <li>... and {result.skippedRecords.length - 5} more</li>
                      )}
                    </ul>
                  )}
                </div>
              )}

              {result.errors && result.errors.length > 0 && (
                <div className="text-sm">
                  <p className="text-red-700 font-medium mb-2">✗ Errors: {result.errors.length} records</p>
                  <ul className="list-disc pl-5 text-red-600 text-xs space-y-1">
                    {result.errors.slice(0, 5).map((err: any, i: number) => (
                      <li key={i}>Row {err.row}: {err.error}</li>
                    ))}
                    {result.errors.length > 5 && (
                      <li>... and {result.errors.length - 5} more</li>
                    )}
                  </ul>
                </div>
              )}

              <div className="flex gap-2">
                <Button 
                  onClick={() => {
                    setResult(null);
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Upload Another
                </Button>
                <Button 
                  onClick={() => {
                    setOpen(false);
                    setResult(null);
                  }}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                >
                  Done
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
