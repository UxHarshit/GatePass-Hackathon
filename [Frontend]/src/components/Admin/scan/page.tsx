import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut } from "lucide-react";
import { QRScanner } from "./qr-scanner";
import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { TeamInfo } from "./teaminfo";

export default function ScanPage() {
  const handleLogout = () => {
    localStorage.removeItem("x-team-email");
    document.cookie =
      "x-team-email=; path=/; max-age=0; secure; samesite=strict";
    window.location.replace("/");
  };
  const [teamData, setTeamData] = useState<any>(null);
  const [scannedData, setScannedData] = useState<string | null>(null);

  const handleScanSuccess = (data: string) => {
    setScannedData(data);
    const [teamId, otp] = data.split("-");
    const parsedTeamId = teamId.replace(/[^a-zA-Z0-9]/g, "").trim();
    const parsedOtp = otp.replace(/[^a-zA-Z0-9]/g, "").trim();
    if (!parsedTeamId || !parsedOtp) {
      setTeamData(null);
      setScannedData(null);
      return;
    }

    fetch("https://gateapi.harshitkatheria.live/detailteam", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        teamId: parsedTeamId,
        otp: parsedOtp,
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          alert("Invalid QR code or OTP. Please try again.");
          setTeamData(null);
          setScannedData(null);
          return;
        }
        const data = await response.json();
        console.log("Team data:", data);
        setTeamData(data.teamdata);
      })
      .catch((error) => {
        console.error("Error fetching team data:", error);
        setTeamData(null);
      });
  };
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
        <h1 className="text-2xl font-bold text-white">Admin Scanner</h1>
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
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {!scannedData ? (
            <motion.div
              key="scanner"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
            >
              <QRScanner onScanSuccess={handleScanSuccess} />
            </motion.div>
          ) : (
            <motion.div
              key="team-info"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              {teamData ? (
                <TeamInfo
                  teamId={teamData.id}
                  teamName={teamData.teamname}
                  leaderName={teamData.leadername}
                  members={teamData.teammembers}
                  onReset={() => {
                    setTeamData(null);
                    setScannedData(null);
                  }}
                />
              ) : (
                <motion.div
                  className="flex h-[300px] w-full max-w-md items-center justify-center rounded-xl border border-white/10 bg-black/40 backdrop-blur-xl backdrop-filter"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-center text-white m-10">
                    <div className="mb-4 text-xl">
                      Hold on, fetching team info.. .🧠🧐
                    </div>
                    <motion.div
                      className="mx-auto h-8 w-8 rounded-full border-b-2 border-t-2 border-emerald-500"
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Number.POSITIVE_INFINITY,
                        duration: 1,
                        ease: "linear",
                      }}
                    />
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
