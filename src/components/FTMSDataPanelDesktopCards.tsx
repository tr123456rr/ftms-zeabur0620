
import React from "react";
import FTMSTimeCard from "./FTMSTimeCard";
import FTMSDistanceCard from "./FTMSDistanceCard";
import FTMSPaceCard from "./FTMSPaceCard";
import FTMSSpeedCard from "./FTMSSpeedCard";
import FTMSCaloriesCard from "./FTMSCaloriesCard";
import FTMSInclineCard from "./FTMSInclineCard";
import FTMSHeartRateCard from "./FTMSHeartRateCard";

interface FTMSData {
  time?: number;
  distance?: number;
  speed?: number;
  calories?: number;
  incline?: number;
  pace?: number;
  heartRate?: number;
}

export default function FTMSDataPanelDesktopCards({ data }: { data: FTMSData }) {
  // 桌面維持 3+4 卡排列
  return (
    <>
      <div className="grid grid-cols-3 gap-6">
        <FTMSTimeCard time={data.time} />
        <FTMSDistanceCard distance={data.distance} />
        <FTMSPaceCard pace={data.pace} />
      </div>
      <div className="grid grid-cols-4 gap-6 mt-4">
        <FTMSSpeedCard speed={data.speed} />
        <FTMSInclineCard incline={data.incline} />
        <FTMSCaloriesCard calories={data.calories} />
        <FTMSHeartRateCard heartRate={data.heartRate} />
      </div>
    </>
  );
}

