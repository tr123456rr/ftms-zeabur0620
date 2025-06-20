
import React from "react";
import { Card } from "@/components/ui/card";

interface FTMSSpeedCardProps {
  speed?: number;
}

const fallback = "--";

const formatUnit = (val?: number, digits = 1): string =>
  typeof val === 'number' && !isNaN(val) ? val.toFixed(digits) : fallback;

const FTMSSpeedCard: React.FC<FTMSSpeedCardProps> = ({ speed }) => (
  <Card className="bg-slate-800 border-slate-700 p-6 h-[128px] flex flex-col items-center justify-center text-center">
    <div className="text-4xl text-green-400 mb-1">
      {formatUnit(speed)}
    </div>
    <div className="text-slate-400 text-lg">速度 (km/H)</div>
  </Card>
);

export default FTMSSpeedCard;
