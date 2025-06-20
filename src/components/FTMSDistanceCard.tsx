
import React from "react";
import { Card } from "@/components/ui/card";

interface FTMSDistanceCardProps {
  distance?: number;
  digits?: number;
}

const fallback = "--";

const formatUnit = (val?: number, digits = 1): string =>
  typeof val === 'number' && !isNaN(val) ? val.toFixed(digits) : fallback;

const FTMSDistanceCard: React.FC<FTMSDistanceCardProps> = ({ distance, digits = 2 }) => (
  <Card className="bg-slate-800 border-slate-700 p-6 h-[128px] flex flex-col items-center justify-center text-center">
    <div className="text-4xl text-blue-400 mb-1">
      {formatUnit(distance, digits)}
    </div>
    <div className="text-slate-400 text-lg">距離 (公里)</div>
  </Card>
);

export default FTMSDistanceCard;
