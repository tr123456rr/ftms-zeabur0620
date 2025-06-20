
import React from "react";
import { Card } from "@/components/ui/card";
import { HeartPulse } from "lucide-react";

interface FTMSHeartRateCardProps {
  heartRate?: number;
}

const FTMSHeartRateCard: React.FC<FTMSHeartRateCardProps> = ({ heartRate }) => {
  // 檢查數值，沒收到有效(>0)資料就顯示0
  const displayHeartRate =
    typeof heartRate === "number" && !isNaN(heartRate) && heartRate > 0
      ? heartRate
      : 0;
  return (
    <Card className="bg-slate-800 border-slate-700 p-6 h-[128px] flex flex-col items-center justify-center text-center">
      <div className="flex items-center justify-center mb-1">
        <HeartPulse className="h-8 w-8 text-pink-500 mr-2 animate-pulse" />
        <span className="text-4xl text-pink-400">
          {displayHeartRate}
        </span>
        <span className="ml-1 text-xl text-pink-300">bpm</span>
      </div>
      <div className="text-slate-400 text-lg">心律</div>
    </Card>
  );
};

export default FTMSHeartRateCard;

