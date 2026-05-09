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
import { createUniversity } from "@/services/university";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  countryName: z.string().min(2, "Country is required"),
  city: z.string().min(2, "City is required"),
  ranking: z.coerce.number().optional(),
  website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  partnerStatus: z.boolean().default(false),
});

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
      alert("Failed to create university");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="bg-emerald-600 hover:bg-emerald-700" />}>
        <Plus size={16} className="mr-2" /> Add University
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New University</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem><FormLabel>University Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="countryName" render={({ field }) => (
                <FormItem><FormLabel>Country</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="city" render={({ field }) => (
                <FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <FormField control={form.control} name="ranking" render={({ field }) => (
              <FormItem><FormLabel>Global Ranking (Optional)</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="website" render={({ field }) => (
              <FormItem><FormLabel>Website (Optional)</FormLabel><FormControl><Input placeholder="https://..." {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <div className="flex items-center gap-2 mt-4">
              <input type="checkbox" id="partner" {...form.register("partnerStatus")} className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-600"/>
              <label htmlFor="partner" className="text-sm font-medium text-gray-700">Is Partner University?</label>
            </div>
            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 mt-4">Save</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
