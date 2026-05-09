"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { searchCourses, StudentProfile } from "@/services/search";
import { saveCourse, removeSavedCourse } from "@/services/shortlist";
import { StudyLevel } from "@prisma/client";
import { Search, Loader2, AlertCircle, ArrowRight, ArrowLeft, BookmarkPlus, Bookmark } from "lucide-react";

export function SearchEngineClient({ domains, userId }: { domains: { id: string, name: string }[], userId: string }) {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);
  const [savedCourses, setSavedCourses] = useState<Set<string>>(new Set());
  const [savingCourseId, setSavingCourseId] = useState<string | null>(null);
  
  const [step, setStep] = useState(1);

  const [form, setForm] = useState<StudentProfile>({
    studyLevel: "",
    domainId: "",
    marks10th: undefined,
    marks12th: undefined,
    marks12thEnglish: undefined,
    gradMarks: undefined,
    ieltsOverall: undefined,
    experienceMonths: undefined,
    backlogs: undefined,
    maxBudget: undefined,
    maxDuration: undefined,
  });

  const handleSaveCourse = async (courseId: string, matchScore: number) => {
    setSavingCourseId(courseId);
    try {
      if (savedCourses.has(courseId)) {
        await removeSavedCourse(userId, courseId);
        setSavedCourses(new Set([...savedCourses].filter(id => id !== courseId)));
      } else {
        await saveCourse(userId, courseId, matchScore);
        setSavedCourses(new Set([...savedCourses, courseId]));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save course");
    } finally {
      setSavingCourseId(null);
    }
  };

  const isPlus2Level = form.studyLevel === "DIPLOMA" || form.studyLevel === "ADVANCED_DIPLOMA";
  const isBachelorsLevel = form.studyLevel === "BACHELORS";
  const isPGLevel = form.studyLevel === "MASTERS" || form.studyLevel === "PG_DIPLOMA";

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await searchCourses(form);
      setResults(data);
      setSearched(true);
    } catch (err) {
      console.error(err);
      alert("Failed to search");
    } finally {
      setLoading(false);
    }
  };

  const getStatusTag = (score: number) => {
    if (score === 100) return <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-xs font-bold">Eligible ✅</span>;
    if (score >= 70) return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-bold">Borderline ⚠️</span>;
    return <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-bold">Not Eligible ❌</span>;
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Search Form Sidebar */}
      <Card className="xl:col-span-1 h-fit">
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="space-y-4">
            
            <div className="flex items-center justify-between mb-4 border-b pb-2">
              <span className="text-sm font-semibold text-gray-500">Step {step} of 3</span>
              {step === 1 && <span className="text-sm font-medium">Study Level</span>}
              {step === 2 && <span className="text-sm font-medium">Academics</span>}
              {step === 3 && <span className="text-sm font-medium">Preferences</span>}
            </div>

            {step === 1 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Study Level (Required)</label>
                  <select 
                    aria-label="Select your study level"
                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                    value={form.studyLevel || ""} 
                    onChange={(e) => setForm({...form, studyLevel: e.target.value as any})}
                    required
                  >
                    <option value="" disabled>Select Study Level</option>
                    {Object.values(StudyLevel).map(level => (
                      <option key={level} value={level}>{level.replace("_", " ")}</option>
                    ))}
                  </select>
                </div>
                
                <Button type="button" onClick={() => setStep(2)} disabled={!form.studyLevel} className="w-full mt-4">
                  Next Step <ArrowRight size={16} className="ml-2" />
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                {/* For +2 levels (DIPLOMA, ADVANCED_DIPLOMA) */}
                {isPlus2Level && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">10th Marks (%)</label>
                        <Input type="number" step="0.1" placeholder="e.g. 85" value={form.marks10th || ""} onChange={(e) => setForm({...form, marks10th: Number(e.target.value) || undefined})} />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">12th Marks (%)</label>
                        <Input type="number" step="0.1" placeholder="e.g. 90" value={form.marks12th || ""} onChange={(e) => setForm({...form, marks12th: Number(e.target.value) || undefined})} />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">12th English Marks (%)</label>
                      <Input type="number" step="0.1" placeholder="e.g. 85" value={form.marks12thEnglish || ""} onChange={(e) => setForm({...form, marks12thEnglish: Number(e.target.value) || undefined})} />
                    </div>
                  </>
                )}

                {/* For Bachelor's level */}
                {isBachelorsLevel && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">12th Marks (%)</label>
                        <Input type="number" step="0.1" placeholder="e.g. 90" value={form.marks12th || ""} onChange={(e) => setForm({...form, marks12th: Number(e.target.value) || undefined})} />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Graduation CGPA/Marks</label>
                        <Input type="number" step="0.1" placeholder="e.g. 3.8 or 85" value={form.gradMarks || ""} onChange={(e) => setForm({...form, gradMarks: Number(e.target.value) || undefined})} />
                      </div>
                    </div>
                  </>
                )}

                {/* For PG levels */}
                {isPGLevel && (
                  <>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Bachelor's CGPA/Marks</label>
                      <Input type="number" step="0.1" placeholder="e.g. 3.8 or 85" value={form.gradMarks || ""} onChange={(e) => setForm({...form, gradMarks: Number(e.target.value) || undefined})} />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Work Experience (Months)</label>
                      <Input type="number" placeholder="e.g. 24" value={form.experienceMonths || ""} onChange={(e) => setForm({...form, experienceMonths: Number(e.target.value) || undefined})} />
                    </div>
                  </>
                )}

                {/* IELTS for all levels */}
                <div>
                  <label className="text-sm font-medium mb-1 block">IELTS Overall Band (Optional)</label>
                  <Input type="number" step="0.5" placeholder="e.g. 6.5" value={form.ieltsOverall || ""} onChange={(e) => setForm({...form, ieltsOverall: Number(e.target.value) || undefined})} />
                </div>

                <div className="flex gap-2 mt-4">
                  <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                    <ArrowLeft size={16} className="mr-2" /> Back
                  </Button>
                  <Button type="button" onClick={() => setStep(3)} className="flex-1">
                    Next <ArrowRight size={16} className="ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Field of Study</label>
                  <select 
                    aria-label="Select field of study"
                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                    value={form.domainId || ""} 
                    onChange={(e) => setForm({...form, domainId: e.target.value})}
                  >
                    <option value="">Any Field</option>
                    {domains.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Max Budget ($)</label>
                    <Input type="number" placeholder="e.g. 20000" value={form.maxBudget || ""} onChange={(e) => setForm({...form, maxBudget: Number(e.target.value) || undefined})} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Max Duration (Mo)</label>
                    <Input type="number" placeholder="e.g. 24" value={form.maxDuration || ""} onChange={(e) => setForm({...form, maxDuration: Number(e.target.value) || undefined})} />
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button type="button" variant="outline" onClick={() => setStep(2)} className="w-1/3">
                    Back
                  </Button>
                  <Button type="submit" className="w-2/3 bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                    Find Matches
                  </Button>
                </div>
              </div>
            )}

          </form>
        </CardContent>
      </Card>

      {/* Results Area */}
      <div className="xl:col-span-2 space-y-4">
        {!searched ? (
          <div className="h-64 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-500 bg-gray-50/50">
            Complete the wizard and click search to view matching courses.
          </div>
        ) : results.length === 0 ? (
          <div className="h-64 border rounded-lg flex flex-col items-center justify-center text-gray-500 bg-white">
             <AlertCircle size={32} className="mb-2 text-gray-400" />
             <p>No courses match this profile.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="font-medium text-gray-700">Found {results.length} matches</h3>
            {results.map(course => (
              <Card key={course.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row">
                  {/* Score indicator */}
                  <div className={`w-full sm:w-24 flex flex-col items-center justify-center p-4 text-white
                    ${course.matchScore >= 80 ? 'bg-emerald-500' : course.matchScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'}
                  `}>
                    <span className="text-3xl font-bold">{course.matchScore}%</span>
                    <span className="text-xs uppercase tracking-wider font-semibold opacity-90">Match</span>
                  </div>
                  
                  {/* Course Details */}
                  <div className="p-5 flex-1">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-lg font-bold text-gray-900">{course.name}</h4>
                          {getStatusTag(course.matchScore)}
                        </div>
                        <p className="text-emerald-700 font-medium text-sm">{course.university?.name} • {course.university?.country?.name}</p>
                      </div>
                      <div className="flex flex-col items-end gap-3">
                        <div className="text-right">
                          <span className="font-bold text-lg">{course.currency} {course.tuitionFees.toLocaleString()}</span>
                          <p className="text-xs text-gray-500">{course.duration} Months</p>
                        </div>
                        <Button
                          onClick={() => handleSaveCourse(course.id, course.matchScore)}
                          disabled={savingCourseId === course.id}
                          variant={savedCourses.has(course.id) ? "default" : "outline"}
                          size="sm"
                          className={savedCourses.has(course.id) ? "bg-blue-600 hover:bg-blue-700" : ""}
                        >
                          {savingCourseId === course.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : savedCourses.has(course.id) ? (
                            <>
                              <Bookmark size={16} className="mr-1" />
                              Saved
                            </>
                          ) : (
                            <>
                              <BookmarkPlus size={16} className="mr-1" />
                              Save
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">{course.studyLevel.replace("_", " ")}</span>
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">{course.domain?.name}</span>
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">{course.intake} Intake</span>
                    </div>

                    {course.penalties && course.penalties.length > 0 && (
                      <div className="mt-3 text-xs text-red-600 bg-red-50 p-2 rounded border border-red-100">
                        <span className="font-semibold block mb-1">Mismatch Warnings:</span>
                        <ul className="list-disc pl-4">
                          {course.penalties.map((p: string, i: number) => <li key={i}>{p}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
