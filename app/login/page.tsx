"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Hardcoded credentials as requested
    if (username.toLowerCase() === "rohit" && password === "frame2remember") {
      document.cookie = "f2r_auth=true; path=/; max-age=86400";
      router.push("/rohit");
    } else {
      setError("Invalid login credentials");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50 dark:bg-dark relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-pink/10 rounded-full blur-3xl -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue/10 rounded-full blur-3xl -ml-48 -mb-48" />

      <div className="w-full max-w-md glass p-10 rounded-[40px] relative z-10 space-y-8">
        <div className="flex flex-col items-center">
            <div className="relative w-48 h-16 mb-4">
                <Image src="/Logo-1.png" alt="F2R" fill className="object-contain" />
            </div>
            <h1 className="text-3xl font-heading">Admin Portal</h1>
            <p className="text-color-text-muted mt-2 text-center text-sm">Welcome back. Please enter your credentials.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-color-text-muted">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl bg-white/50 dark:bg-white/5 border border-glass-border focus:border-pink outline-none transition-all"
              placeholder="Username"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-color-text-muted">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl bg-white/50 dark:bg-white/5 border border-glass-border focus:border-pink outline-none transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className="text-salmon text-sm bg-salmon/10 p-4 rounded-xl">{error}</p>}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-dark text-white rounded-2xl font-bold hover:bg-pink transition-all duration-300 disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Login"}
          </button>
        </form>

        <div className="text-center">
            <p className="text-xs text-color-text-muted italic">Forgotten your password? Please check your email: rohitbasaknote@gmail.com</p>
        </div>
      </div>
    </div>
  );
}
