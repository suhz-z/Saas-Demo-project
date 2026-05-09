"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Globe, MapPin, Trophy, Link2, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createUniversity } from "@/services/university";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  countryName: z.string().min(2, "Country is required"),
  city: z.string().min(2, "City is required"),
  ranking: z.coerce.number().optional(),
  website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  partnerStatus: z.boolean().default(false),
});

const inputClass = "h-9 rounded-lg bg-muted/40 border-border/50 text-[13px] focus-visible:ring-primary/20";
const labelClass = "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground";

export function UniversityFormDialog() {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      name: "",
      countryName: "",
      city: "",
      ranking: undefined,
      website: "",
      partnerStatus: false,
    }
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      await createUniversity({
        ...values,
        website: values.website || undefined,
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
            <Plus size={15} className="mr-1.5" /> Add University
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle className="text-[17px] font-semibold flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-primary/8 flex items-center justify-center text-primary">
              <Globe size={16} />
            </div>
            Add University
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-2">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className={labelClass}>University Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Harvard University" className={inputClass} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="grid grid-cols-2 gap-3">
              <FormField control={form.control} name="countryName" render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className={labelClass}>Country</FormLabel>
                  <FormControl>
                    <Input placeholder="USA" className={inputClass} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="city" render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className={labelClass}>City</FormLabel>
                  <FormControl>
                    <Input placeholder="Cambridge" className={inputClass} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormField control={form.control} name="ranking" render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className={labelClass}>QS Ranking</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="1" className={inputClass} {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="website" render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className={labelClass}>Website</FormLabel>
                  <FormControl>
                    <Input placeholder="https://…" className={inputClass} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <div
              className={`p-3 rounded-lg border cursor-pointer flex items-center justify-between transition-colors ${
                form.watch("partnerStatus")
                  ? "bg-primary/5 border-primary/20"
                  : "bg-muted/30 border-border/50 hover:bg-muted/50"
              }`}
              onClick={() => form.setValue("partnerStatus", !form.watch("partnerStatus"))}
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle2
                  size={16}
                  className={form.watch("partnerStatus") ? "text-primary" : "text-muted-foreground/50"}
                />
                <div className="flex flex-col">
                  <span className="text-[13px] font-medium">Partner University</span>
                  <span className="text-[11px] text-muted-foreground">Priority listing in search results</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)} className="h-9 rounded-lg text-[13px] px-4">
                Cancel
              </Button>
              <Button type="submit" size="sm" className="flex-1 h-9 rounded-lg bg-primary text-[13px] font-medium">
                Save University
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
