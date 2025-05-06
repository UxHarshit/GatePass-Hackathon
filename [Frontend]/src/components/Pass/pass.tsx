import {motion} from "framer-motion";
import {Button} from "@/components/ui/button";
import {LogOut} from "lucide-react";
import {useEffect} from "react";
import QrPage from "./QrPage";
import { HackathonTimer } from "./Timer";

export default function PassPage(props: any) {

  useEffect(() => {
    const email = localStorage.getItem("x-team-email");
    if (!email) {
      window.location.replace("/");
    }
  }, []);


  // const hackathonStartDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days from now
  // const hackathonEndDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 days from now

  // test
  // const hackathonStartDate = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
  // const hackathonEndDate = new Date(Date.now() + 1 * 60 * 1000) // 1 minute from now

  const hackathonStartDate = new Date("2025-05-09T09:00:00");
  const hackathonEndDate = new Date("2025-05-10T16:00:00");

  const handleLogout = () => {
    localStorage.removeItem("x-team-email");
    document.cookie = "x-team-email=; path=/; max-age=0; secure; samesite=strict";
    window.location.replace("/");
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 p-4 overflow-hidden">
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

        {/* Animated gradient orbs */}
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

      <motion.div
        className="relative z-10 mb-8 mt-4 flex w-full max-w-md items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold text-white">Team Pass</h1>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="border-white/10 bg-black/30 text-white hover:bg-white/10 hover:text-white"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </motion.div>
      </motion.div>

      <div className="relative z-10 space-y-6">
        <HackathonTimer startDate={hackathonStartDate} endDate={hackathonEndDate}/>
        <QrPage props={props} />
      </div>
    </div>
  );
}
