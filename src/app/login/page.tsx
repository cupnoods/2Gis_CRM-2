"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, User, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui";

export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Persist active session in browser
    localStorage.setItem("oshbiz_user", JSON.stringify({ email, name: name || email.split("@")[0] }));
    router.push("/catalogue");
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-[#e4e7ec] bg-white p-8 shadow-sm">
        <div className="text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-indigo-600 text-xl font-bold text-white">
            O
          </div>
          <h2 className="mt-4 text-2xl font-bold text-[#101828]">
            {isSignUp ? "Create an account" : "Welcome back to OshBiz"}
          </h2>
          <p className="mt-1 text-sm text-[#667085]">
            {isSignUp
              ? "Start managing 2GIS business leads in Osh"
              : "Sign in to access your CRM workspace"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="text-xs font-semibold text-[#344054]">Full Name</label>
              <div className="relative mt-1">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#98a2b3]" />
                <input
                  required
                  type="text"
                  placeholder="Alex Will"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-10 w-full rounded-lg border border-[#d0d5dd] pl-10 pr-3 text-sm outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-[#344054]">Email address</label>
            <div className="relative mt-1">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#98a2b3]" />
              <input
                required
                type="email"
                placeholder="alex@oshbiz.kg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 w-full rounded-lg border border-[#d0d5dd] pl-10 pr-3 text-sm outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#344054]">Password</label>
            <div className="relative mt-1">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#98a2b3]" />
              <input
                required
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10 w-full rounded-lg border border-[#d0d5dd] pl-10 pr-3 text-sm outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          <Button variant="primary" className="w-full">
            {isSignUp ? "Sign Up" : "Sign In"} <ArrowRight size={16} />
          </Button>
        </form>

        <div className="border-t border-[#f2f4f7] pt-4 text-center text-xs text-[#667085]">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="font-semibold text-indigo-600 hover:underline"
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}
