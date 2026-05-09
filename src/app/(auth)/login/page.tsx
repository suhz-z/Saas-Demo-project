"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Mail, Lock, Loader2, ArrowRight, AlertCircle } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const labelClass = "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground";
const inputClass = "h-10 rounded-lg bg-muted/40 border-border/50 text-[14px] focus-visible:ring-primary/20";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    try {
      setIsLoading(true);
      setError("");
      const response = await axios.post("/api/auth/login", values);

      const { role } = response.data.user;
      if (role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/counselor");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full overflow-hidden">
      <div className="hidden lg:flex lg:w-[45%] relative bg-zinc-950 items-center justify-center overflow-hidden">
        {/* Abstract Background Effects */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-500/20 blur-[120px]" />
        
        <div className="absolute inset-0 subtle-grid opacity-[0.05]" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 text-white px-16 max-w-xl"
        >
          <div className="flex items-center gap-3 mb-16">
            <div className="bg-gradient-to-br from-primary to-blue-600 shadow-xl shadow-primary/20 w-10 h-10 rounded-xl flex items-center justify-center text-[14px] font-extrabold text-white tracking-tight">
              SA
            </div>
            <span className="text-[16px] font-bold tracking-widest uppercase text-white/90">SACDMS</span>
          </div>

          <h1 className="text-[2.75rem] font-bold tracking-tight mb-6 leading-[1.15]">
            <span className="text-white/90">Intelligent</span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-400 to-primary bg-300% animate-gradient">
              Course Discovery
            </span>
          </h1>
          <p className="text-[16px] text-zinc-400 leading-relaxed mb-14 max-w-md font-medium">
            Empowering counselors and administrators with data-driven academic matching.
          </p>

          <div className="flex gap-10">
            <div className="space-y-1">
              <div className="text-3xl font-bold text-white tracking-tight">500+</div>
              <div className="text-[11px] text-zinc-500 font-bold uppercase tracking-[0.2em]">Universities</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold text-white tracking-tight">12k+</div>
              <div className="text-[11px] text-zinc-500 font-bold uppercase tracking-[0.2em]">Courses</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold text-white tracking-tight">45</div>
              <div className="text-[11px] text-zinc-500 font-bold uppercase tracking-[0.2em]">Countries</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right — Form */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-8 bg-background">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="w-full max-w-sm"
        >
          {/* Mobile brand */}
          <div className="mb-8 lg:hidden flex items-center gap-2.5">
            <div className="bg-primary/90 w-8 h-8 rounded-lg flex items-center justify-center text-[12px] font-extrabold text-white">
              SA
            </div>
            <span className="text-[15px] font-bold tracking-tight">SACDMS</span>
          </div>

          <div className="space-y-1.5 mb-8">
            <h2 className="text-2xl font-bold tracking-tight">Sign in</h2>
            <p className="text-[14px] text-muted-foreground">Enter your credentials to continue.</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className={labelClass}>Email</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                        <Input placeholder="admin@sacdms.com" className={`pl-9 ${inputClass}`} {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className={labelClass}>Password</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                        <Input type="password" placeholder="••••••••" className={`pl-9 ${inputClass}`} {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-3 rounded-lg bg-destructive/8 text-destructive text-[13px] font-medium flex items-center gap-2"
                >
                  <AlertCircle size={14} />
                  {error}
                </motion.div>
              )}

              <Button
                type="submit"
                className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-[14px] font-medium shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 group"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>Sign in <ArrowRight className="ml-2 h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform" /></>
                )}
              </Button>
            </form>
          </Form>

          <p className="mt-8 text-center text-[13px] text-muted-foreground">
            Need help? <button className="text-primary font-medium hover:underline">Contact support</button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
