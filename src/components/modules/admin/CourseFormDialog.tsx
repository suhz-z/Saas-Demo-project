"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createCourse } from "@/services/course";
import { StudyLevel } from "@prisma/client";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  universityId: z.string().min(1, "University is required"),
  studyLevel: z.nativeEnum(StudyLevel),
  domainName: z.string().min(2, "Domain is required"),
  degreeType: z.string().min(2, "Degree type is required"),
  duration: z.coerce.number().min(1),
  tuitionFees: z.coerce.number().min(0),
  currency: z.string().min(1),
  intake: z.string().min(2),
  description: z.string().optional(),
});

export function CourseFormDialog({ universities }: { universities: { id: string, name: string }[] }) {
  const [open, setOpen] = useState(false);
  
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      name: "",
      universityId: "",
      studyLevel: StudyLevel.BACHELORS,
      domainName: "",
      degreeType: "",
      duration: 12,
      tuitionFees: 0,
      currency: "USD",
      intake: "Fall",
      description: "",
    }
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      await createCourse(values);
      setOpen(false);
      form.reset();
    } catch (e) {
      console.error(e);
      alert("Failed to create course");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button size="sm" className="h-9 px-4 rounded-lg bg-primary hover:bg-primary/90 text-[13px] font-medium shadow-sm">
            <Plus size={15} className="mr-1.5" /> Add Course
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Course</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem><FormLabel>Course Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />

            <FormField control={form.control} name="universityId" render={({ field }) => (
              <FormItem>
                <FormLabel>University</FormLabel>
                <FormControl>
                  <select {...field} className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2">
                    <option value="" disabled>Select University</option>
                    {universities.map(u => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="studyLevel" render={({ field }) => (
                <FormItem>
                  <FormLabel>Study Level</FormLabel>
                  <FormControl>
                    <select {...field} className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm">
                      {Object.values(StudyLevel).map(level => (
                        <option key={level} value={level}>{level.replace("_", " ")}</option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              
              <FormField control={form.control} name="domainName" render={({ field }) => (
                <FormItem><FormLabel>Domain</FormLabel><FormControl><Input placeholder="e.g. Computer Science" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="degreeType" render={({ field }) => (
                <FormItem><FormLabel>Degree Type</FormLabel><FormControl><Input placeholder="e.g. B.Sc, M.Sc" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="duration" render={({ field }) => (
                <FormItem><FormLabel>Duration (Months)</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <FormField control={form.control} name="tuitionFees" render={({ field }) => (
                <FormItem><FormLabel>Tuition Fees</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="currency" render={({ field }) => (
                <FormItem><FormLabel>Currency</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>

            <FormField control={form.control} name="intake" render={({ field }) => (
              <FormItem><FormLabel>Intake</FormLabel><FormControl><Input placeholder="e.g. Fall 2024" {...field} /></FormControl><FormMessage /></FormItem>
            )} />

            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 mt-4">Save Course</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
