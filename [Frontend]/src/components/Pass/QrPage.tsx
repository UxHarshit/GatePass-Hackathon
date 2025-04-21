import { useEffect, useState, useRef, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "../ui/glass-card";
import { Button } from "../ui/button";
import QrCode from "react-qr-code";
import { Progress } from "../ui/progress";
import * as OTPAuth from "otpauth";

interface PropsQra {
  props: any;
}

export default function QrPage({
  props,
}: PropsQra) {
  const [totpToken, setTotpToken] = useState<string>("s");
  const [timeLeft, setTimeLeft] = useState(30);
  const [isQrCodeVisible, setIsQrCodeVisible] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {id, leaderemail, leadername, leaderphone, teamname, deskno } =
    props.teamDetails.team;
  const secret = "KVKFKRCPNZQUYMLXOVYDSQKJKZDTSRLD";
  const generateTOTP = (timestamp = Date.now()) => {
    const totp = new OTPAuth.TOTP({
      secret: OTPAuth.Secret.fromBase32(secret),
      algorithm: "SHA1",
      digits: 6,
      period: 30,
    });

    const code = totp.generate({ timestamp });
    const data = `${id}-${code}`;
    const base64Data = btoa(data);
    return base64Data;
  };

  useEffect(() => {
    const updateToken = () => {
      const now = Date.now();
      const timeStep = Math.floor(now / 1000 / 30);
      const nextTime = (timeStep + 1) * 30 * 1000;
      const remaining = Math.floor((nextTime - now) / 1000);

      setTotpToken(generateTOTP(now));
      setTimeLeft(remaining);
      setIsQrCodeVisible(true);

      return nextTime - now;
    };

    let timeout = updateToken();

    const tick = () => {
      timeout = updateToken();
      timer = setTimeout(tick, timeout);
    };

    let timer = setTimeout(tick, timeout);

    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [props.id]);

  return (
    <GlassCard className="flex flex-col items-center p-8" delay={0.2}>
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-2 text-xl font-semibold text-white"
      >
        Your Gate Pass
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mb-6 text-center text-emerald-200/70"
      >
        Show this QR code to the admin at the entrance
      </motion.p>
      <motion.div
        className="mb-6 rounded-xl bg-white p-4"
        whileHover={{
          scale: 1.02,
          boxShadow: "0 0 20px rgba(16, 185, 129, 0.2)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            className="flex items-center justify-center"
            key={"totpToken"}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            {isQrCodeVisible && !isRefreshing && (
              <QrCode value={totpToken} size={300} />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
      <motion.div
        className="w-full space-y-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex justify-between text-sm text-emerald-200/70">
          <span>QR refreshes in:</span>
          <span>{timeLeft} seconds</span>
        </div>
        <div className="relative h-2 w-full rounded-full bg-black/30">
          <Progress
            value={(timeLeft / 30) * 100}
            className="h-2 bg-emerald-500/20 bg-gradient-to-r from-emerald-600 to-teal-700"
            style={{ width: `${(timeLeft / 30) * 100}%` }}
          />
        </div>
      </motion.div>

      <motion.div
        className="mt-6 w-full space-y-2 rounded-lg bg-black/30 p-4 text-white"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex justify-between">
          <span className="font-medium text-emerald-200">Team:</span>
          <span>{teamname}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-emerald-200">Leader:</span>
          <span>{leadername}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-emerald-200">Email:</span>
          <span>{leaderemail}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-emerald-200">
            Registration Desk:
          </span>
          <span>{deskno}</span>
        </div>
      </motion.div>
    </GlassCard>
  );
}
