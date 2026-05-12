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
import { Mail, Lock, Loader2, ArrowRight, AlertCircle, Globe, BookOpen, GraduationCap } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    try {
      setIsLoading(true);
      setError("");
      const response = await axios.post("/api/auth/login", values);
      const { role } = response.data.user;
      if (role === "ADMIN") router.push("/admin");
      else router.push("/counselor");
    } catch (err: any) {
      setError(err.response?.data?.error || "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full overflow-hidden relative bg-[oklch(0.075_0.018_275)]">
      {/* ── Full-page gassy background ── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Grain texture */}
        <div
          className="absolute inset-0 opacity-[0.55] mix-blend-screen"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.15'/%3E%3C/svg%3E")`,
            backgroundSize: "256px 256px",
          }}
        />

        {/* Plasma orbs */}
        <div
          className="gassy-orb-1 animate-plasma-pulse"
          style={{ width: "55vw", height: "55vw", top: "-15%", left: "-10%", opacity: 0.7 }}
        />
        <div
          className="gassy-orb-2 animate-plasma-pulse"
          style={{ width: "45vw", height: "45vw", bottom: "-15%", right: "-8%", opacity: 0.6, animationDelay: "3s" }}
        />
        <div
          className="gassy-orb-3"
          style={{ width: "35vw", height: "35vw", top: "35%", left: "35%", opacity: 0.5, animationDelay: "7s" }}
        />

        {/* Dot grid */}
        <div className="absolute inset-0 dot-grid opacity-30" />
      </div>

      {/* ─────────────────────────────────────────── */}
      {/* LEFT PANEL */}
      {/* ─────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[48%] relative items-center justify-center overflow-hidden">
        {/* Inner panel glass */}
        <div className="absolute inset-4 rounded-3xl glass grain-overlay overflow-hidden">
          {/* Inner accent orb */}
          <div
            className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, oklch(0.68 0.22 290 / 0.3) 0%, transparent 70%)",
              filter: "blur(60px)",
              animation: "orb-float-1 12s ease-in-out infinite",
            }}
          />
          <div
            className="absolute -bottom-20 -right-20 w-[400px] h-[400px] rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, oklch(0.62 0.20 195 / 0.25) 0%, transparent 70%)",
              filter: "blur(80px)",
              animation: "orb-float-2 16s ease-in-out infinite",
            }}
          />

          {/* Thin top-edge accent line */}
          <div
            className="absolute top-0 inset-x-0 h-[1px] pointer-events-none"
            style={{
              background: "linear-gradient(90deg, transparent, oklch(0.68 0.22 290 / 0.7) 40%, oklch(0.62 0.20 195 / 0.5) 60%, transparent)",
            }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 px-16 max-w-xl w-full"
        >
          {/* Logo */}
          <div className="flex items-center gap-3.5 mb-16">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center text-[13px] font-extrabold text-white tracking-tight shadow-2xl"
              style={{
                background: "linear-gradient(135deg, oklch(0.68 0.22 290), oklch(0.58 0.22 260))",
                boxShadow: "0 0 24px oklch(0.68 0.22 290 / 0.5), 0 4px 12px oklch(0 0 0 / 0.4)",
              }}
            >
              SA
            </div>
            <span className="text-[15px] font-bold tracking-[0.18em] uppercase text-white/80">SACDMS</span>
          </div>

          {/* Headline */}
          <h1 className="text-[2.6rem] font-bold tracking-tight mb-6 leading-[1.12] text-white/90">
            Study Abroad Course<br />
            <span className="text-plasma">Discovery & Management</span>
          </h1>

          <p className="text-[15px] text-white/40 leading-relaxed mb-16 max-w-sm font-medium">
            Empowering counselors and administrators with data-driven academic matching across 45 countries.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6">
            {[
              { icon: <Globe size={14} />, value: "500+", label: "Universities" },
              { icon: <BookOpen size={14} />, value: "12k+", label: "Courses" },
              { icon: <GraduationCap size={14} />, value: "45", label: "Countries" },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="plasma-border rounded-xl p-3.5 flex flex-col gap-2"
              >
                <span className="text-white/30">{s.icon}</span>
                <span className="text-2xl font-bold text-white tracking-tight">{s.value}</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-semibold">{s.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ─────────────────────────────────────────── */}
      {/* RIGHT PANEL — Form */}
      {/* ─────────────────────────────────────────── */}
      <div className="w-full lg:w-[52%] flex items-center justify-center p-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="w-full max-w-[380px]"
        >
          {/* Mobile brand */}
          <div className="mb-8 lg:hidden flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-[12px] font-extrabold text-white"
              style={{
                background: "linear-gradient(135deg, oklch(0.68 0.22 290), oklch(0.58 0.22 260))",
                boxShadow: "0 0 18px oklch(0.68 0.22 290 / 0.4)",
              }}
            >
              SA
            </div>
            <span className="text-[15px] font-bold tracking-tight text-white/90">SACDMS</span>
          </div>

          {/* Form card */}
          <div className="glass-card grain-overlay rounded-2xl p-8 relative overflow-hidden">
            {/* Top edge glow line */}
            <div
              className="absolute top-0 inset-x-0 h-[1px] pointer-events-none"
              style={{
                background: "linear-gradient(90deg, transparent 10%, oklch(0.68 0.22 290 / 0.6) 50%, transparent 90%)",
              }}
            />

            {/* Heading */}
            <div className="space-y-1.5 mb-8 relative z-10">
              <h2 className="text-2xl font-bold tracking-tight text-white/90">Welcome back</h2>
              <p className="text-[13px] text-white/35">Sign in to your SACDMS account</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 relative z-10">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-[11px] font-semibold uppercase tracking-wider text-white/40">
                        Email
                      </FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-[oklch(0.68_0.22_290)] transition-colors duration-200" />
                          <Input
                            placeholder="admin@sacdms.com"
                            className="pl-9 h-10 rounded-xl text-[14px] text-white/80 placeholder:text-white/20 border-[oklch(0.28_0.04_272_/_0.6)] bg-[oklch(0.09_0.018_272_/_0.7)] focus-visible:border-[oklch(0.68_0.22_290_/_0.5)] focus-visible:ring-[oklch(0.68_0.22_290_/_0.15)] focus-visible:ring-3"
                            {...field}
                          />
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
                      <FormLabel className="text-[11px] font-semibold uppercase tracking-wider text-white/40">
                        Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-[oklch(0.68_0.22_290)] transition-colors duration-200" />
                          <Input
                            type="password"
                            placeholder="••••••••"
                            className="pl-9 h-10 rounded-xl text-[14px] text-white/80 placeholder:text-white/20 border-[oklch(0.28_0.04_272_/_0.6)] bg-[oklch(0.09_0.018_272_/_0.7)] focus-visible:border-[oklch(0.68_0.22_290_/_0.5)] focus-visible:ring-[oklch(0.68_0.22_290_/_0.15)] focus-visible:ring-3"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-xl text-[13px] font-medium flex items-center gap-2.5 text-red-300"
                    style={{
                      background: "oklch(0.40 0.18 27 / 0.12)",
                      border: "1px solid oklch(0.50 0.18 27 / 0.3)",
                    }}
                  >
                    <AlertCircle size={14} className="shrink-0" />
                    {error}
                  </motion.div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 rounded-xl text-[14px] font-semibold text-white border-0 transition-all duration-300 group relative overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, oklch(0.65 0.22 290), oklch(0.58 0.22 260))",
                    boxShadow: isLoading
                      ? "none"
                      : "0 0 24px oklch(0.68 0.22 290 / 0.35), 0 4px 12px oklch(0 0 0 / 0.3)",
                  }}
                >
                  {/* shimmer */}
                  <span
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: "linear-gradient(105deg, transparent 30%, oklch(1 0 0 / 0.1) 50%, transparent 70%)",
                      backgroundSize: "200% 100%",
                      animation: "shimmer 1.4s linear infinite",
                    }}
                  />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>Sign in <ArrowRight className="h-4 w-4 opacity-70 group-hover:translate-x-0.5 transition-transform" /></>
                    )}
                  </span>
                </Button>
              </form>
            </Form>

            <p className="mt-6 text-center text-[12px] text-white/25 relative z-10">
              Need help?{" "}
              <button className="text-[oklch(0.75_0.18_290)] font-medium hover:text-[oklch(0.85_0.18_290)] transition-colors">
                Contact support
              </button>
            </p>
          </div>

          {/* Demo accounts */}
          <div className="mt-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/25 mb-3 text-center">
              Demo Accounts
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { role: "Administrator", email: "admin@sacdms.com", pass: "password123" },
                { role: "Counselor", email: "counselor1@sacdms.com", pass: "password123" },
              ].map((d) => (
                <div
                  key={d.role}
                  className="p-3 rounded-xl relative overflow-hidden cursor-pointer group"
                  style={{
                    background: "oklch(0.10 0.02 272 / 0.6)",
                    border: "1px solid oklch(0.25 0.035 272 / 0.8)",
                    backdropFilter: "blur(12px)",
                  }}
                  onClick={() => {
                    form.setValue("email", d.email);
                    form.setValue("password", d.pass);
                  }}
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                      background: "oklch(0.68 0.22 290 / 0.05)",
                    }}
                  />
                  <p className="text-[11px] font-bold text-white/70 mb-0.5">{d.role}</p>
                  <p className="text-[10px] text-white/30 truncate">{d.email}</p>
                  <p className="text-[10px] text-[oklch(0.75_0.18_290)] font-medium mt-1">Click to fill</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
