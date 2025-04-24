import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Check, CircleX, Cross } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface TeamMember {
  name: string;
  ispresent: string;
}

interface TeamInfoProps {
  teamId: string;
  teamName: string;
  leaderName: string;
  members: TeamMember[];
  onReset: () => void;
}

export function TeamInfo({
  teamId,
  teamName,
  leaderName,
  members,
  onReset,
}: TeamInfoProps) {
  const [memberList, setMemberList] = useState<TeamMember[]>(members);
  const [isLoading, setIsLoading] = useState(false);

  const handleMarkPresent = (name: string) => {
    setMemberList((prevMembers) => {
      const updatedMembers = prevMembers.map((member) =>
        member.name === name ? { ...member, ispresent: "true" } : member
      );
      updateServerData(updatedMembers);
      return updatedMembers;
    });
  };

  const handleMarkAbsent = (name: string) => {
    setMemberList((prevMembers) => {
      const updatedMembers = prevMembers.map((member) =>
        member.name === name ? { ...member, ispresent: "false" } : member
      );
      updateServerData(updatedMembers);
      return updatedMembers;
    });
  };

  const updateServerData = (prevDataState: TeamMember[]) => {
    setIsLoading(true);
    fetch("https://gateapi.harshitkatheria.live/present", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        teamId: teamId,
        teammembers: prevDataState.map((member) => ({
          name: member.name,
          ispresent: member.ispresent,
        })),
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setMemberList(data.teamdata.teammembers);
      })
      .catch((error) => {
        console.error("Error updating server data:", error);
        setMemberList(prevDataState);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <GlassCard className="w-full max-w-md">
      <motion.div
        className="mb-4 flex items-center justify-between gap-2 "
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-semibold text-white">Team Information</h2>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="border-white/10 bg-black/30 text-white hover:bg-white/10 ml-2 hover:text-white"
          >
            Scan Another
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        className="mb-6 space-y-2 rounded-lg bg-black/30 p-4 text-white"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex justify-between">
          <span className="font-medium text-emerald-200">Team:</span>
          <span>{teamName}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-emerald-200">Leader:</span>
          <span>{leaderName}</span>
        </div>
      </motion.div>

      <div className="mb-4">
        <motion.h3
          className="mb-2 font-medium text-emerald-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Team Members
        </motion.h3>
        <div className="space-y-3">
          {memberList.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
              className="flex items-center justify-between rounded-lg bg-black/30 p-3 transition-all duration-300 hover:bg-black/40"
            >
              <div className="text-white">
                <div className="font-medium">{member.name}</div>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="sm"
                  variant={member.ispresent != "true" ? "default" : "default"}
                  className={
                    member.ispresent != "true"
                      ? "bg-emerald-700 text-white hover:bg-emerald-800"
                      : "bg-red-700 text-white hover:bg-red-800"
                  }
                  disabled={isLoading}
                >
                  <AnimatePresence mode="wait">
                    {member.ispresent == "true" ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center"
                        onClick={() => handleMarkAbsent(member.name)}
                      >
                        <CircleX className="mr-1 h-4 w-4" /> Mark Absent
                      </motion.div>
                    ) : (
                      <motion.span
                        onClick={() => handleMarkPresent(member.name)}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center"
                      >
                        <Check className="mr-1 h-4 w-4" /> Mark Present
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}
