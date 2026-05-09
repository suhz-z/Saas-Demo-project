"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, CalendarDays } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createAcademicCycle } from "@/services/intakes";

const schema = z.object({
  intakeName: z.string().min(2, "Name is required"),
  month: z.coerce.number().min(1).max(12),
  year: z.coerce.number().min(new Date().getFullYear()),
  applicationDeadline: z.string().min(1, "Deadline is required"),
});

const inputClass = "h-9 rounded-lg bg-muted/40 border-border/50 text-[13px] focus-visible:ring-primary/20";
const labelClass = "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground";

export function IntakeFormDialog() {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      intakeName: "Fall",
      month: 9,
      year: new Date().getFullYear(),
      applicationDeadline: "",
    }
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      await createAcademicCycle({
        intakeName: values.intakeName,
        month: values.month,
        year: values.year,
        applicationDeadline: new Date(values.applicationDeadline),
      });
      setOpen(false);
      form.reset();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button size="sm" className="h-9 px-4 rounded-lg bg-primary hover:bg-primary/90 text-[13px] font-medium shadow-sm">
            <Plus size={15} className="mr-1.5" /> Add Intake
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-[17px] font-semibold flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-primary/8 flex items-center justify-center text-primary">
              <CalendarDays size={16} />
            </div>
            Add Academic Intake
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-2">
            <FormField control={form.control} name="intakeName" render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className={labelClass}>Intake Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Fall, Spring, Summer" className={inputClass} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="grid grid-cols-2 gap-3">
              <FormField control={form.control} name="month" render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className={labelClass}>Start Month (1-12)</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} max={12} className={inputClass} {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="year" render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className={labelClass}>Start Year</FormLabel>
                  <FormControl>
                    <Input type="number" className={inputClass} {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <FormField control={form.control} name="applicationDeadline" render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className={labelClass}>Application Deadline</FormLabel>
                <FormControl>
                  <Input type="date" className={inputClass} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="flex gap-2 pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)} className="h-9 rounded-lg text-[13px] px-4">
                Cancel
              </Button>
              <Button type="submit" size="sm" className="flex-1 h-9 rounded-lg bg-primary text-[13px] font-medium">
                Save Intake
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
