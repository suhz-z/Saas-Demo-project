"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { searchCourses, StudentProfile } from "@/services/search";
import { saveCourse, removeSavedCourse } from "@/services/shortlist";
import { StudyLevel } from "@prisma/client";
import { Search, Loader2, AlertCircle, ArrowRight, ArrowLeft, BookmarkPlus, Bookmark, CheckCircle2, Info, MapPin, Calendar, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

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
        await removeSavedCourse(courseId);
        setSavedCourses(new Set([...savedCourses].filter(id => id !== courseId)));
      } else {
        await saveCourse(userId, courseId, matchScore);
        setSavedCourses(new Set([...savedCourses, courseId]));
      }
    } catch (err) {
      console.error(err);
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
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600 bg-emerald-500/8";
    if (score >= 50) return "text-amber-600 bg-amber-500/8";
    return "text-rose-600 bg-rose-500/8";
  };

  const inputClass = "h-9 rounded-lg bg-muted/40 border-border/50 text-[13px] focus-visible:ring-primary/20";
  const labelClass = "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground";

  return (
    <div className="space-y-6">


      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Search Panel */}
        <Card className="xl:col-span-4 border border-[oklch(0.24_0.035_272_/_0.65)] overflow-hidden sticky top-20" style={{ background: "linear-gradient(145deg, oklch(0.11 0.022 272 / 0.85), oklch(0.09 0.018 275 / 0.8))", backdropFilter: "blur(20px)" }}>
          {/* Step Indicator */}
          <div className="px-6 pt-5 pb-4 border-b border-border/40">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-8 w-8 rounded-lg bg-primary/8 flex items-center justify-center text-primary">
                <Search size={16} />
              </div>
              <div>
                <h3 className="text-[15px] font-semibold tracking-tight">Match Finder</h3>
                <p className="text-[11px] text-muted-foreground">Step {step} of 3</p>
              </div>
            </div>

            <div className="flex gap-1.5">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                    step >= s ? "bg-primary" : "bg-border"
                  }`}
                />
              ))}
            </div>
          </div>

          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="space-y-5">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <label className={labelClass}>Study Level</label>
                      <div className="grid grid-cols-1 gap-1.5">
                        {Object.values(StudyLevel).map(level => (
                          <button
                            key={level}
                            type="button"
                            onClick={() => setForm({...form, studyLevel: level as any})}
                            className={`px-3 py-2.5 rounded-lg border text-left text-[13px] transition-all ${
                              form.studyLevel === level
                                ? "bg-primary/8 border-primary/30 text-primary font-semibold"
                                : "border-border/50 hover:bg-muted/30 text-foreground/80"
                            }`}
                          >
                            {level.replace("_", " ")}
                          </button>
                        ))}
                      </div>
                    </div>

                    <Button
                      type="button"
                      onClick={() => setStep(2)}
                      disabled={!form.studyLevel}
                      className="w-full h-9 rounded-lg bg-primary hover:bg-primary/90 text-[13px] font-medium"
                    >
                      Continue <ArrowRight size={14} className="ml-1.5" />
                    </Button>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    {isPlus2Level && (
                      <>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <label className={labelClass}>10th Marks (%)</label>
                            <Input type="number" step="0.1" placeholder="85" className={inputClass} value={form.marks10th || ""} onChange={(e) => setForm({...form, marks10th: Number(e.target.value) || undefined})} />
                          </div>
                          <div className="space-y-1.5">
                            <label className={labelClass}>12th Marks (%)</label>
                            <Input type="number" step="0.1" placeholder="90" className={inputClass} value={form.marks12th || ""} onChange={(e) => setForm({...form, marks12th: Number(e.target.value) || undefined})} />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className={labelClass}>12th English (%)</label>
                          <Input type="number" step="0.1" placeholder="85" className={inputClass} value={form.marks12thEnglish || ""} onChange={(e) => setForm({...form, marks12thEnglish: Number(e.target.value) || undefined})} />
                        </div>
                      </>
                    )}

                    {isBachelorsLevel && (
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className={labelClass}>12th Marks (%)</label>
                          <Input type="number" step="0.1" placeholder="90" className={inputClass} value={form.marks12th || ""} onChange={(e) => setForm({...form, marks12th: Number(e.target.value) || undefined})} />
                        </div>
                        <div className="space-y-1.5">
                          <label className={labelClass}>Grad CGPA</label>
                          <Input type="number" step="0.1" placeholder="3.8" className={inputClass} value={form.gradMarks || ""} onChange={(e) => setForm({...form, gradMarks: Number(e.target.value) || undefined})} />
                        </div>
                      </div>
                    )}

                    {isPGLevel && (
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className={labelClass}>Bachelor's CGPA</label>
                          <Input type="number" step="0.1" placeholder="8.5" className={inputClass} value={form.gradMarks || ""} onChange={(e) => setForm({...form, gradMarks: Number(e.target.value) || undefined})} />
                        </div>
                        <div className="space-y-1.5">
                          <label className={labelClass}>Work Exp (Mo.)</label>
                          <Input type="number" placeholder="24" className={inputClass} value={form.experienceMonths || ""} onChange={(e) => setForm({...form, experienceMonths: Number(e.target.value) || undefined})} />
                        </div>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <label className={labelClass}>IELTS Overall</label>
                      <Input type="number" step="0.5" placeholder="6.5" className={inputClass} value={form.ieltsOverall || ""} onChange={(e) => setForm({...form, ieltsOverall: Number(e.target.value) || undefined})} />
                    </div>

                    <div className="flex gap-2 pt-1">
                      <Button type="button" variant="outline" size="sm" onClick={() => setStep(1)} className="h-9 rounded-lg text-[13px] px-3">
                        <ArrowLeft size={14} className="mr-1" /> Back
                      </Button>
                      <Button type="button" size="sm" onClick={() => setStep(3)} className="flex-1 h-9 rounded-lg bg-primary text-[13px]">
                        Continue <ArrowRight size={14} className="ml-1" />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <div className="space-y-1.5">
                      <label className={labelClass}>Field of Study</label>
                      <select
                        className="flex h-9 w-full rounded-lg bg-muted/40 border border-border/50 px-3 py-1.5 text-[13px] outline-none focus:ring-2 focus:ring-primary/20"
                        value={form.domainId || ""}
                        onChange={(e) => setForm({...form, domainId: e.target.value})}
                      >
                        <option value="">Any Field</option>
                        {domains.map(d => (
                          <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className={labelClass}>Budget ($)</label>
                        <Input type="number" placeholder="20000" className={inputClass} value={form.maxBudget || ""} onChange={(e) => setForm({...form, maxBudget: Number(e.target.value) || undefined})} />
                      </div>
                      <div className="space-y-1.5">
                        <label className={labelClass}>Max Duration (Mo.)</label>
                        <Input type="number" placeholder="24" className={inputClass} value={form.maxDuration || ""} onChange={(e) => setForm({...form, maxDuration: Number(e.target.value) || undefined})} />
                      </div>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <Button type="button" variant="outline" size="sm" onClick={() => setStep(2)} className="h-9 rounded-lg text-[13px] px-3">
                        Back
                      </Button>
                      <Button type="submit" size="sm" className="flex-1 h-9 rounded-lg bg-primary text-[13px] font-medium" disabled={loading}>
                        {loading ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Search className="mr-1.5 h-4 w-4" />}
                        Find Matches
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="xl:col-span-8 space-y-5">
          {!searched ? (
            <div className="h-[420px] rounded-xl border border-dashed flex flex-col items-center justify-center gap-3" style={{ borderColor: "oklch(0.28 0.04 272 / 0.5)", background: "oklch(0.09 0.018 272 / 0.4)", color: "oklch(0.45 0.03 270)" }}>
              <Search size={36} className="opacity-10" />
              <div className="text-center">
                <p className="text-[15px] font-semibold text-foreground/70">Ready to search</p>
                <p className="text-[13px] mt-1 max-w-xs mx-auto">Complete the profile wizard to discover optimized university matches.</p>
              </div>
            </div>
          ) : results.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-[420px] rounded-xl border flex flex-col items-center justify-center gap-3" style={{ borderColor: "oklch(0.24 0.035 272 / 0.5)", background: "oklch(0.09 0.018 272 / 0.4)", color: "oklch(0.45 0.03 270)" }}
            >
              <AlertCircle size={36} className="mb-3 text-rose-400/50" />
              <p className="text-[15px] font-semibold text-foreground">No matches found</p>
              <p className="text-[13px] mt-1">Try broadening your criteria.</p>
              <Button variant="link" size="sm" onClick={() => setStep(1)} className="mt-3 text-primary text-[13px]">Adjust Filters</Button>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-[15px] font-semibold">{results.length} matches found</p>
                <Badge variant="outline" className="text-[11px]">Sorted by score</Badge>
              </div>

              <div className="space-y-3">
                {results.map((course, idx) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Card className="border border-[oklch(0.26_0.04_272_/_0.6)] hover:border-[oklch(0.68_0.22_290_/_0.3)] transition-all group cursor-pointer" style={{ background: "linear-gradient(145deg, oklch(0.11 0.022 272 / 0.8), oklch(0.09 0.018 275 / 0.75))", backdropFilter: "blur(16px)" }}>
                      <CardContent className="p-5">
                        <div className="flex flex-col md:flex-row gap-5">
                          {/* Score */}
                          <div className="flex md:flex-col items-center justify-center gap-1 md:w-16 shrink-0">
                            <span className={`text-2xl font-bold ${scoreColor(course.matchScore).split(" ")[0]}`}>
                              {course.matchScore}
                            </span>
                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">score</span>
                          </div>

                          {/* Details */}
                          <div className="flex-1 min-w-0 space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                              <div className="space-y-1.5">
                                <h4 className="text-[15px] font-semibold text-foreground leading-tight">{course.name}</h4>
                                <div className="flex items-center gap-3 text-[12px] text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <MapPin size={12} className="text-muted-foreground/50" />
                                    {course.university?.name}, {course.university?.country?.name}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Calendar size={12} className="text-muted-foreground/50" />
                                    {course.intake}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 shrink-0">
                                <div className="text-right">
                                  <p className="text-[15px] font-bold">{course.currency} {course.tuitionFees.toLocaleString()}</p>
                                  <p className="text-[11px] text-muted-foreground flex items-center justify-end gap-1">
                                    <Clock size={10} /> {course.duration}mo
                                  </p>
                                </div>
                                <Button
                                  onClick={() => handleSaveCourse(course.id, course.matchScore)}
                                  disabled={savingCourseId === course.id}
                                  variant={savedCourses.has(course.id) ? "default" : "outline"}
                                  size="sm"
                                  className={`h-8 rounded-lg text-[12px] px-3 ${
                                    savedCourses.has(course.id)
                                      ? "bg-primary text-white"
                                      : "border-border text-foreground/70 hover:bg-muted/50"
                                  }`}
                                >
                                  {savingCourseId === course.id ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  ) : savedCourses.has(course.id) ? (
                                    <><Bookmark size={13} className="mr-1 fill-current" /> Saved</>
                                  ) : (
                                    <><BookmarkPlus size={13} className="mr-1" /> Save</>
                                  )}
                                </Button>
                              </div>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap items-center gap-1.5">
                              <Badge variant="secondary" className="text-[11px]">
                                {course.studyLevel.replace("_", " ")}
                              </Badge>
                              <Badge variant="secondary" className="text-[11px]">
                                {course.domain?.name}
                              </Badge>

                              {/* PRD Requirement: Visual Status Tags */}
                              {course.matchScore === 100 && (
                                <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-500/20 text-[11px] font-bold">
                                  Eligible ✅
                                </Badge>
                              )}
                              {course.matchScore >= 70 && course.matchScore < 100 && (
                                <Badge className="bg-amber-500/10 text-amber-700 border-amber-500/20 text-[11px] font-bold">
                                  Borderline ⚠️
                                </Badge>
                              )}
                              {course.matchScore < 70 && (
                                <Badge className="bg-rose-500/10 text-rose-700 border-rose-500/20 text-[11px] font-bold">
                                  Not Eligible ❌
                                </Badge>
                              )}

                              {course.scholarshipAvailable && (
                                <Badge className="bg-emerald-500/8 text-emerald-600 border-emerald-500/15 text-[11px]">
                                  Scholarship
                                </Badge>
                              )}
                            </div>

                            {/* Warnings */}
                            {course.penalties && course.penalties.length > 0 && (
                              <div className="bg-rose-50 dark:bg-rose-950/10 p-3 rounded-lg border border-rose-100 dark:border-rose-900/20">
                                <p className="text-[11px] font-semibold text-rose-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                                  <Info size={12} /> Eligibility Gaps
                                </p>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                                  {course.penalties.map((p: string, i: number) => (
                                    <li key={i} className="text-[11px] text-rose-500/80 flex items-start gap-1.5">
                                      <span className="mt-1.5 h-1 w-1 rounded-full bg-rose-400 shrink-0" />
                                      {p}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
