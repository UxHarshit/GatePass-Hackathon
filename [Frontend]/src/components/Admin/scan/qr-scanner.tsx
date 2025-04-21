import { useEffect, useState, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Camera, CameraOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface QRScannerProps {
  onScanSuccess: (data: string) => void;
}

export function QRScanner({ onScanSuccess }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [cameraId, setCameraId] = useState("");
  const [listOfCameras, setListOfCameras] = useState<any[]>([]);
  const [error, setError] = useState("");
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerId = "qr-scanner-container";

  const startScanner = async () => {
    try {
      setError("");
      setIsScanning(true);

      await new Promise((resolve) => setTimeout(resolve, 200));

      const element = document.getElementById(scannerContainerId);
      if (!element) {
        setError("Scanner container not found.");
        setIsScanning(false);
        return;
      }

      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode(scannerContainerId);
      }
      await scannerRef.current.start(
        { deviceId: { exact: cameraId } },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          stopScanner();
          const parsedData = atob(decodedText);
          var [teamId, code] = parsedData.split("-");
          teamId = teamId.replace(/[^a-zA-Z0-9]/g, "").trim();
          code = code.replace(/[^a-zA-Z0-9]/g, "").trim();
          if (!teamId || !code || ["undefined", "null", "invalid"].includes(teamId.toLowerCase())) {
            setError("Invalid QR code.");
            setIsScanning(false);
            return;
          }
          onScanSuccess(parsedData);
        },
        (errorMessage) => {
          if (
            !errorMessage.includes(
              "No MultiFormat Readers were able to detect the code."
            )
          ) {
            console.warn("QR code parse error:", errorMessage);
          }
        }
      );
    } catch (err) {
      console.error(err);
      setError("Failed to start camera. Please check permissions.");
      setIsScanning(false);
    }
  };
  const stopScanner = async () => {
    if (scannerRef.current) {
      if (scannerRef.current.isScanning) {
        try {
          await scannerRef.current.stop();
          await scannerRef.current.clear();
        } catch (err) {
          console.warn("Error stopping scanner:", err);
        }
      } else {
        console.log("Stop called, but scanner is not active.");
      }
    }
    setIsScanning(false);
  };


  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        if (scannerRef.current.isScanning) {
          scannerRef.current
            .stop()
            .catch((err) => console.warn("Stop error on unmount:", err))
            .finally(() => scannerRef.current?.clear());
        } else {
          scannerRef.current.clear();
        }
      }
    };
  }, []);

  useEffect(() => {
    const fetchCameras = async () => {
      try {
        const devices = await Html5Qrcode.getCameras();
        if (devices && devices.length > 0) {
          setListOfCameras(devices);
          setCameraId(devices[devices.length - 1].id);
        } else {
          setError("No cameras found.");
        }
      } catch (err) {
        console.error("Error fetching cameras:", err);
        setError("Failed to fetch camera list.");
      }
    };
    fetchCameras();
  }, []);

  const [isSwitching, setIsSwitching] = useState(false);

  useEffect(() => {
    const switchCamera = async () => {
      if (!listOfCameras.length) return;

      const camera = listOfCameras.find((cam) => cam.id === cameraId);
      if (!camera) {
        setError("Selected camera not found.");
        return;
      }

      if (scannerRef.current?.isScanning) {
        await stopScanner();
      }

      await startScanner();
    };

    switchCamera();
  }, [cameraId, listOfCameras]);

  return (
    <GlassCard className="w-full max-w-md">
      <motion.div
        className="mb-4 text-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-semibold text-white">Scan Team QR Code</h2>
        <p className="text-emerald-200/70">
          Position the QR code within the scanner frame
        </p>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 rounded-md bg-red-900/30 p-3 text-sm text-white"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        className="flex justify-center mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {listOfCameras.length > 0 && (
          <select
            className="rounded-md border border-white/10 bg-black/40 p-2 text-sm text-white disabled:opacity-50"
            value={cameraId}
            disabled={isSwitching}
            onChange={(e) => setCameraId(e.target.value)}
          >
            {listOfCameras.map((camera) => (
              <option key={camera.id} value={camera.id}>
                {camera.label}
              </option>
            ))}
          </select>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        id={scannerContainerId}
        className="relative mx-auto mb-4 h-[300px] w-full max-w-[300px] overflow-hidden rounded-lg bg-black/40 shadow-[0_0_15px_rgba(0,0,0,0.3)]"
      >
        {!isScanning && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 2,
                ease: "easeInOut",
              }}
            >
              <Camera className="mb-2 h-12 w-12 text-emerald-400/50" />
            </motion.div>
            <p className="text-center text-sm text-emerald-200/70">
              Camera will appear here
            </p>
          </motion.div>
        )}
      </motion.div>

      <motion.div
        className="flex justify-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {isScanning ? (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={stopScanner}
              variant="destructive"
              className="flex items-center gap-2 bg-red-900/70 hover:bg-red-800"
            >
              <CameraOff className="h-4 w-4" />
              Stop Scanning
            </Button>
          </motion.div>
        ) : (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={startScanner}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-700 to-teal-800 text-white hover:from-emerald-800 hover:to-teal-900"
            >
              <Camera className="h-4 w-4" />
              Start Scanning
            </Button>
          </motion.div>
        )}
      </motion.div>
    </GlassCard>
  );
}
