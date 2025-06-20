
import React from "react";
import { Card } from "@/components/ui/card";

interface FTMSTimeCardProps {
  time?: number;
}

const fallback = "--";

const formatTime = (seconds?: number): string => {
  if (
    seconds === undefined ||
    seconds === null ||
    isNaN(seconds) ||
    seconds === 0
  ) {
    return fallback;
  }
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const FTMSTimeCard: React.FC<FTMSTimeCardProps> = ({ time }) => (
  <Card className="bg-slate-800 border-slate-700 p-6 text-center">
    <div className="text-4xl font-mono font-bold text-cyan-400 mb-2">
      {formatTime(time)}
    </div>
    <div className="text-slate-400 text-lg">時間</div>
  </Card>
);

export default FTMSTimeCard;
