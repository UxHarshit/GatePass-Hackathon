import { motion } from "framer-motion";
import { useState } from "react";
import LoginForm from "./Form";

export default function LoginPage() {
  return (
    <>
      <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 p-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.div
            className="absolute top-0 left-0 w-full h-full bg-[url('/placeholder.svg?height=100&width=100')] bg-repeat opacity-5"
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "mirror",
              duration: 60,
              ease: "linear",
            }}
          />

          <motion.div
            className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-emerald-900/20 blur-3xl"
            animate={{
              x: [0, 50, -50, 0],
              y: [0, -50, 50, 0],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 20,
              ease: "easeInOut",
            }}
          />

          <motion.div
            className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-teal-900/20 blur-3xl"
            animate={{
              x: [0, -50, 50, 0],
              y: [0, 50, -50, 0],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 15,
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="relative z-10">
            <LoginForm/>
        </div>
      </div>
    </>
  );
}
