"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createUser } from "@/services/user";

const schema = z.object({
  email: z.email("Enter a valid email address"),
  name: z.string().min(2, "Name is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["ADMIN", "COUNSELOR"]),
});

export function UserFormDialog() {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      role: "COUNSELOR",
    },
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      await createUser(values);
      setOpen(false);
      form.reset();
    } catch (e) {
      console.error(e);
      alert("Failed to create user");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button size="sm" className="h-9 px-4 rounded-lg bg-primary hover:bg-primary/90 text-[13px] font-medium shadow-sm">
            <Plus size={15} className="mr-1.5" /> Add User
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Counselor Account</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" autoComplete="new-password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="flex h-10 w-full rounded-xl border px-3 py-2 text-sm" style={{ background: "oklch(0.09 0.018 272 / 0.7)", borderColor: "oklch(0.26 0.04 272 / 0.6)", color: "oklch(0.78 0.015 268)" }}
                    >
                      <option value="COUNSELOR">COUNSELOR</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
              Save User
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
