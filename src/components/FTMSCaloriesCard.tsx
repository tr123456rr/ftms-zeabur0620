
import React from "react";
import { Card } from "@/components/ui/card";

interface FTMSCaloriesCardProps {
  calories?: number;
}

const fallback = "--";

const FTMSCaloriesCard: React.FC<FTMSCaloriesCardProps> = ({ calories }) => (
  <Card className="bg-slate-800 border-slate-700 p-6 h-[128px] flex flex-col items-center justify-center text-center">
    <div className="text-4xl text-orange-400 mb-1">
      {typeof calories === 'number' && !isNaN(calories)
        ? Math.round(calories)
        : fallback}
    </div>
    <div className="text-slate-400 text-lg">卡路里 (kcal)</div>
  </Card>
);

export default FTMSCaloriesCard;
