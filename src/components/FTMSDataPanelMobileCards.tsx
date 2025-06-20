
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

/**
 * 行動裝置卡片排列（共7卡）：
 * 第一行：時間（獨佔寬度）
 * 第二行：距離、速度
 * 第三行：步伐、坡度
 * 第四行：卡路里、心律
 */
export default function FTMSDataPanelMobileCards({ data }: { data: FTMSData }) {
  return (
    <div className="flex flex-col gap-3">
      {/* 第一行：時間（獨佔一行） */}
      <div className="flex w-full">
        <div className="w-full min-w-0">
          <FTMSTimeCard time={data.time} />
        </div>
      </div>
      {/* 第二行：距離、速度 */}
      <div className="flex gap-3">
        <div className="w-1/2 min-w-0">
          <FTMSDistanceCard distance={data.distance} />
        </div>
        <div className="w-1/2 min-w-0">
          <FTMSSpeedCard speed={data.speed} />
        </div>
      </div>
      {/* 第三行：步伐、卡路里（已調換卡路里和坡度位置） */}
      <div className="flex gap-3">
        <div className="w-1/2 min-w-0">
          <FTMSPaceCard pace={data.pace} />
        </div>
        <div className="w-1/2 min-w-0">
          <FTMSCaloriesCard calories={data.calories} />
        </div>
      </div>
      {/* 第四行：坡度、心律（已調換卡路里和坡度位置） */}
      <div className="flex gap-3">
        <div className="w-1/2 min-w-0">
          <FTMSInclineCard incline={data.incline} />
        </div>
        <div className="w-1/2 min-w-0">
          <FTMSHeartRateCard heartRate={data.heartRate} />
        </div>
      </div>
    </div>
  );
}

