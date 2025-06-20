
import React from "react";
import { Card } from "@/components/ui/card";

interface FTMSPaceCardProps {
  pace?: number;
}

// 只剩待機 fallback 不再用 "--"，用 0:00
const formatPace = (pace?: number): string => {
  if (pace === undefined || isNaN(pace) || pace <= 0) return "0:00";
  const minutes = Math.floor(pace);
  const seconds = Math.floor((pace % 1) * 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const FTMSPaceCard: React.FC<FTMSPaceCardProps> = ({ pace }) => (
  <Card className="bg-slate-800 border-slate-700 p-6 h-[128px] flex flex-col items-center justify-center text-center">
    <div className="text-4xl text-purple-400 mb-1">
      {formatPace(pace)}
    </div>
    <div className="text-slate-400 text-lg">步伐 (min/km)</div>
  </Card>
);

export default FTMSPaceCard;

