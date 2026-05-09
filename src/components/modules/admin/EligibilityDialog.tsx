"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ClipboardCheck, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getEligibilityRule, saveEligibilityRule } from "@/services/eligibility";

export function EligibilityDialog({ courseId, courseName }: { courseId: string, courseName: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState({
    min10thMarks: "",
    min12thMarks: "",
    minGradMarks: "",
    minIeltsOverall: "",
    minIeltsReading: "",
    minIeltsWriting: "",
    minIeltsSpeaking: "",
    minIeltsListening: "",
    minExperience: "",
    maxBacklogs: "",
  });

  useEffect(() => {
    if (open) {
      loadData();
    }
  }, [open]);

  const loadData = async () => {
    setLoading(true);
    try {
      const rule = await getEligibilityRule(courseId);
      if (rule) {
        setData({
          min10thMarks: rule.min10thMarks?.toString() || "",
          min12thMarks: rule.min12thMarks?.toString() || "",
          minGradMarks: rule.minGradMarks?.toString() || "",
          minIeltsOverall: rule.minIeltsOverall?.toString() || "",
          minIeltsReading: rule.minIeltsReading?.toString() || "",
          minIeltsWriting: rule.minIeltsWriting?.toString() || "",
          minIeltsSpeaking: rule.minIeltsSpeaking?.toString() || "",
          minIeltsListening: rule.minIeltsListening?.toString() || "",
          minExperience: rule.minExperience?.toString() || "",
          maxBacklogs: rule.maxBacklogs?.toString() || "",
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveEligibilityRule(courseId, {
        min10thMarks: data.min10thMarks ? Number(data.min10thMarks) : null,
        min12thMarks: data.min12thMarks ? Number(data.min12thMarks) : null,
        minGradMarks: data.minGradMarks ? Number(data.minGradMarks) : null,
        minIeltsOverall: data.minIeltsOverall ? Number(data.minIeltsOverall) : null,
        minIeltsReading: data.minIeltsReading ? Number(data.minIeltsReading) : null,
        minIeltsWriting: data.minIeltsWriting ? Number(data.minIeltsWriting) : null,
        minIeltsSpeaking: data.minIeltsSpeaking ? Number(data.minIeltsSpeaking) : null,
        minIeltsListening: data.minIeltsListening ? Number(data.minIeltsListening) : null,
        minExperience: data.minExperience ? Number(data.minExperience) : null,
        maxBacklogs: data.maxBacklogs ? Number(data.maxBacklogs) : null,
      });
      alert("Eligibility rules saved successfully!");
      setOpen(false);
    } catch (err) {
      alert("Failed to save rules");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          />
        }
      >
        <ClipboardCheck size={16} />
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Eligibility Requirements: {courseName}</DialogTitle>
        </DialogHeader>
        
        {loading ? (
           <div className="flex justify-center p-8"><Loader2 className="animate-spin text-emerald-600" /></div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            {/* Board Exam Marks */}
            <div>
              <h3 className="font-semibold text-sm text-gray-700 mb-3">Board Exam Marks (%)</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">10th Marks</label>
                  <Input type="number" step="0.1" placeholder="0-100" value={data.min10thMarks} onChange={e => setData({...data, min10thMarks: e.target.value})} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">12th Marks</label>
                  <Input type="number" step="0.1" placeholder="0-100" value={data.min12thMarks} onChange={e => setData({...data, min12thMarks: e.target.value})} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Graduation GPA/Marks</label>
                  <Input type="number" step="0.1" placeholder="e.g. 3.5 or 85" value={data.minGradMarks} onChange={e => setData({...data, minGradMarks: e.target.value})} />
                </div>
              </div>
            </div>

            {/* IELTS Requirements */}
            <div>
              <h3 className="font-semibold text-sm text-gray-700 mb-3">IELTS Requirements</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Overall Band</label>
                  <Input type="number" step="0.5" placeholder="0-9" value={data.minIeltsOverall} onChange={e => setData({...data, minIeltsOverall: e.target.value})} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Reading</label>
                  <Input type="number" step="0.5" placeholder="0-9" value={data.minIeltsReading} onChange={e => setData({...data, minIeltsReading: e.target.value})} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Writing</label>
                  <Input type="number" step="0.5" placeholder="0-9" value={data.minIeltsWriting} onChange={e => setData({...data, minIeltsWriting: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Speaking</label>
                  <Input type="number" step="0.5" placeholder="0-9" value={data.minIeltsSpeaking} onChange={e => setData({...data, minIeltsSpeaking: e.target.value})} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Listening</label>
                  <Input type="number" step="0.5" placeholder="0-9" value={data.minIeltsListening} onChange={e => setData({...data, minIeltsListening: e.target.value})} />
                </div>
              </div>
            </div>

            {/* Experience & Backlogs */}
            <div>
              <h3 className="font-semibold text-sm text-gray-700 mb-3">Other Requirements</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Min Experience (Months)</label>
                  <Input type="number" placeholder="e.g. 24" value={data.minExperience} onChange={e => setData({...data, minExperience: e.target.value})} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Max Backlogs Allowed</label>
                  <Input type="number" placeholder="e.g. 2" value={data.maxBacklogs} onChange={e => setData({...data, maxBacklogs: e.target.value})} />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={saving} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save Requirements"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
