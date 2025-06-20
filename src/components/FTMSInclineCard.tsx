
import React from "react";
import { Card } from "@/components/ui/card";

interface FTMSInclineCardProps {
  incline?: number;
}

const fallback = "0.0";

const FTMSInclineCard: React.FC<FTMSInclineCardProps> = ({ incline }) => (
  <Card className="bg-slate-800 border-slate-700 p-6 h-[128px] flex flex-col items-center justify-center text-center">
    <div className="text-4xl text-red-400 mb-1">
      {typeof incline === 'number' && !isNaN(incline)
        ? incline.toFixed(1)
        : fallback}
    </div>
    <div className="text-slate-400 text-lg">坡度</div>
  </Card>
);

export default FTMSInclineCard;

