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
import { createStudent } from "@/services/student";
import { StudyLevel } from "@prisma/client";

const schema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Valid email required").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  highestLevel: z.nativeEnum(StudyLevel),
  gradMarks: z.coerce.number().optional(),
  ieltsOverall: z.coerce.number().optional(),
});

export function StudentFormDialog() {
  const [open, setOpen] = useState(false);
  
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      highestLevel: StudyLevel.BACHELORS,
      gradMarks: undefined,
      ieltsOverall: undefined,
    }
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      await createStudent({
        ...values,
        email: values.email || undefined,
        phone: values.phone || undefined,
      });
      setOpen(false);
      form.reset();
    } catch (e) {
      console.error(e);
      alert("Failed to create student");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="bg-emerald-600 hover:bg-emerald-700" />}>
        <Plus size={16} className="mr-2" /> Add Student
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Student Profile</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="firstName" render={({ field }) => (
                <FormItem><FormLabel>First Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="lastName" render={({ field }) => (
                <FormItem><FormLabel>Last Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="phone" render={({ field }) => (
                <FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>

            <FormField control={form.control} name="highestLevel" render={({ field }) => (
              <FormItem>
                <FormLabel>Highest Education</FormLabel>
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

            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="gradMarks" render={({ field }) => (
                <FormItem><FormLabel>GPA / Marks</FormLabel><FormControl><Input type="number" step="0.1" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="ieltsOverall" render={({ field }) => (
                <FormItem><FormLabel>IELTS Score</FormLabel><FormControl><Input type="number" step="0.5" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            
            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 mt-4">Save Profile</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
