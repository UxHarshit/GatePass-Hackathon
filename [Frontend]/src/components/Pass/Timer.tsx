"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { Clock, Hourglass } from "lucide-react"

interface HackathonTimerProps {
  startDate: Date
  endDate: Date
  className?: string
}

export function HackathonTimer({ startDate, endDate, className }: HackathonTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  } | null>(null)

  const [timeElapsed, setTimeElapsed] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  } | null>(null)

  const [isStarted, setIsStarted] = useState(false)
  const [isEnded, setIsEnded] = useState(false)

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date()

      if (now >= endDate) {
        setIsEnded(true)
        setIsStarted(true)
        return
      }

      if (now >= startDate) {
        setIsStarted(true)

        const elapsedMs = now.getTime() - startDate.getTime()
        const elapsedSeconds = Math.floor(elapsedMs / 1000)
        const elapsedMinutes = Math.floor(elapsedSeconds / 60)
        const elapsedHours = Math.floor(elapsedMinutes / 60)
        const elapsedDays = Math.floor(elapsedHours / 24)

        setTimeElapsed({
          days: elapsedDays,
          hours: elapsedHours % 24,
          minutes: elapsedMinutes % 60,
          seconds: elapsedSeconds % 60,
        })
      } else {
        const remainingMs = startDate.getTime() - now.getTime()
        const remainingSeconds = Math.floor(remainingMs / 1000)
        const remainingMinutes = Math.floor(remainingSeconds / 60)
        const remainingHours = Math.floor(remainingMinutes / 60)
        const remainingDays = Math.floor(remainingHours / 24)

        setTimeRemaining({
          days: remainingDays,
          hours: remainingHours % 24,
          minutes: remainingMinutes % 60,
          seconds: remainingSeconds % 60,
        })
      }
    }

    calculateTime()

    const interval = setInterval(calculateTime, 1000)

    return () => clearInterval(interval)
  }, [startDate, endDate])

  const formatTimeUnit = (value: number): string => {
    return value.toString().padStart(2, "0")
  }

  const timeUnitVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
  }

  return (
    <GlassCard className={`w-full max-w-md ${className}`}>
      <div className="flex items-center justify-center mb-4">
        <motion.div
          animate={{ rotate: isStarted ? 0 : 360 }}
          transition={{ duration: 1, repeat: isStarted ? 0 : Number.POSITIVE_INFINITY, ease: "linear" }}
          className="mr-2"
        >
          {isStarted ? (
            <Clock className="h-5 w-5 text-emerald-400" />
          ) : (
            <Hourglass className="h-5 w-5 text-emerald-400" />
          )}
        </motion.div>
        <h2 className="text-xl font-semibold text-white">
          {isEnded ? "Hackathon Ended" : isStarted ? "Hackathon in Progress" : "Hackathon Starts In"}
        </h2>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-4">
        {isStarted
          ?
            timeElapsed && (
              <>
                <TimeUnit label="Days" value={formatTimeUnit(timeElapsed.days)} />
                <TimeUnit label="Hours" value={formatTimeUnit(timeElapsed.hours)} />
                <TimeUnit label="Minutes" value={formatTimeUnit(timeElapsed.minutes)} />
                <TimeUnit label="Seconds" value={formatTimeUnit(timeElapsed.seconds)} />
              </>
            )
          :
            timeRemaining && (
              <>
                <TimeUnit label="Days" value={formatTimeUnit(timeRemaining.days)} />
                <TimeUnit label="Hours" value={formatTimeUnit(timeRemaining.hours)} />
                <TimeUnit label="Minutes" value={formatTimeUnit(timeRemaining.minutes)} />
                <TimeUnit label="Seconds" value={formatTimeUnit(timeRemaining.seconds)} />
              </>
            )}
      </div>

    <div className="text-center text-emerald-200/70 text-sm">
      {isEnded
        ? "Thank you for participating!"
        : isStarted
        ? `Hackathon ends on ${endDate.toLocaleDateString("en-GB")} at ${endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
        : `Hackathon starts on ${startDate.toLocaleDateString("en-GB")} at ${startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
    </div>
    </GlassCard>
  )
}

interface TimeUnitProps {
  label: string
  value: string
}

function TimeUnit({ label, value }: TimeUnitProps) {
  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="bg-black/50 rounded-md w-full py-3 px-2 text-center mb-1"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <motion.span
          key={value}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-2xl font-mono font-bold text-white"
        >
          {value}
        </motion.span>
      </motion.div>
      <span className="text-xs text-emerald-200/70">{label}</span>
    </motion.div>
  )
}
