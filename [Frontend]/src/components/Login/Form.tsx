import { GlassCard } from "@/components/ui/glass-card";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Alert, AlertDescription } from "../ui/alert";
import { AlertCircle, Eye, EyeOff } from "lucide-react";

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const inputVariants = {
    focus: {
      scale: 1.02,
      transition: { duration: 0.2 },
    },
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("https://gateapi.harshitkatheria.live/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("x-team-email", email);
        document.cookie = `x-team-email=${email}; path=/; max-age=${60 * 60 * 24}; secure; samesite=strict`;
        window.location.replace("/pass");
      } else {
        setError(data.error || "Invalid credentials. Please try again.");
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GlassCard className="w-full max-w-md">
      <div className="mb-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-2xl font-bold text-white"
        >
         HackIndia Hackathon Gate Pass
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-emerald-200/70"
        >
          Team Login
        </motion.p>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Alert variant="destructive" className="mb-4 bg-red-900/50 text-white">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Label htmlFor="email" className="text-emerald-100">Email</Label>
          <motion.div whileFocus="focus" variants={inputVariants}>
            <Input
              id="email"
              type="email"
              placeholder="teamleader@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-white/10 bg-black/30 text-white placeholder:text-white/40 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
            />
          </motion.div>
        </motion.div>

        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <Label htmlFor="password" className="text-emerald-100">Password</Label>
          <motion.div className="relative" whileFocus="focus" variants={inputVariants}>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="teamname + leadername"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pr-10 border-white/10 bg-black/30 text-white placeholder:text-white/40 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-2 text-emerald-300 hover:text-white"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </motion.div>
          <p className="text-xs text-emerald-200/70">
            Password format: TeamName first 2 letters + Leader Name's first 2
            letters + Team Leader's phone number last 4 digits.
            <br /> Example: teamname + leadername + 1234 = tele1234
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-700 to-teal-800 text-white hover:from-emerald-800 hover:to-teal-900"
            disabled={isLoading}
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, ease: "linear" }}
                className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"
              />
            ) : null}
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
          >
            <p className="text-xs text-emerald-200/70">For any issues, contact us on <a href="https://chat.whatsapp.com/F7YxFuUGcC108KKOy1PxHF" className="text-emerald-500">WhatsApp</a> or email us at {" "}
            <a href="mailto:hexclan@liet.in" className="text-emerald-500">
              hexclan@liet.in
            </a></p>
          </motion.div>
      </form>
      <footer className="mt-6 text-center text-sm text-emerald-200/70">
        <p>Made with </p>
        <motion.p
          initial={{ scale: 1 }}
          animate={{ scale: 1.2 }}
          transition={{ repeat: Infinity, duration: 0.5, ease: "easeInOut" }}
          className="text-emerald-500"
        >
          ❤️
        </motion.p>
        <p> by <a href="https://harshitkatheria.engineer" className="text-emerald-500">Harshit Katheria</a></p>
      </footer>
    </GlassCard>
  );
}
