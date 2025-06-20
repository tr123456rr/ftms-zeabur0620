
import { useState, useCallback } from "react";
import { useRunningData } from "@/hooks/useRunningData";
import type { User } from "./useFTMSUser";
import type { FTMSData } from "./useFTMSDataHistory";

export function useFTMSSaveRecord(user: User | null, dataHistoryRef: React.RefObject<FTMSData[]>) {
  const [isSaving, setIsSaving] = useState(false);
  const { saveRecord, ...rest } = useRunningData(user);

  // 計算平均值輔助 function
  const calcAverages = (history: FTMSData[]) => {
    const speedSum = history.reduce((sum, d) => sum + (typeof d.speed === "number" ? d.speed : 0), 0);
    const speedCount = history.filter((d) => typeof d.speed === "number").length;
    const avgSpeed = speedCount > 0 ? speedSum / speedCount : undefined;

    const hrSum = history.reduce((sum, d) => sum + (typeof d.heartRate === "number" ? d.heartRate : 0), 0);
    const hrCount = history.filter((d) => typeof d.heartRate === "number").length;
    const avgHeartRate = hrCount > 0 ? Math.round(hrSum / hrCount) : undefined;

    const inclineSum = history.reduce((sum, d) => sum + (typeof d.incline === "number" ? d.incline : 0), 0);
    const inclineCount = history.filter((d) => typeof d.incline === "number").length;
    const avgIncline = inclineCount > 0 ? inclineSum / inclineCount : undefined;

    return { avgSpeed, avgHeartRate, avgIncline };
  };

  // pace數值(float/number) 格式化成 "m:ss"
  const formatPaceValue = (pace?: number): string => {
    if (typeof pace !== "number" || isNaN(pace) || pace <= 0 || pace > 999) return "--:--";
    const min = Math.floor(pace);
    const sec = Math.round((pace - min) * 60);
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  // saveFn 呼叫時傳入斷線時的最後一筆資料
  const handleSaveRecord = useCallback(
    async (disconnectedData: FTMSData | undefined) => {
      const history = dataHistoryRef.current || [];
      if (!disconnectedData || history.length === 0) return;
      setIsSaving(true);

      // 計算平均
      const { avgSpeed, avgHeartRate, avgIncline } = calcAverages(history);

      // 直接使用藍牙面板最後一筆步伐，保證和面板一致
      let avgPace = "--:--";
      if (typeof disconnectedData.pace === "number" && disconnectedData.pace > 0 && disconnectedData.pace < 999) {
        avgPace = formatPaceValue(disconnectedData.pace);
      } else {
        // 若最後一筆沒有 pace，再 fallback 用 distance/time 計算（避免 distance 接近 0 出現 0:01 問題）
        const totalDistance = typeof disconnectedData.distance === "number" ? disconnectedData.distance : 0;
        const totalTime = typeof disconnectedData.time === "number" ? disconnectedData.time : 0;
        if (totalDistance > 0.05 && totalTime > 0) { // 閾值可視情況調整
          const minPerKm = totalTime / 60 / totalDistance;
          // 過濾不合邏輯速度（如 distance 極小），大於999分鐘/km 或小於1分鐘/km則視為異常
          if (minPerKm >= 1 && minPerKm < 999) {
            const min = Math.floor(minPerKm);
            const sec = Math.round((minPerKm - min) * 60);
            avgPace = `${min}:${sec.toString().padStart(2, "0")}`;
          } else {
            avgPace = "--:--";
          }
        } else {
          avgPace = "--:--";
        }
      }

      // 正確帶入 calories
      const duration = Math.round(disconnectedData.time ?? 0);
      const distance = Number(disconnectedData.distance ?? 0);
      const pace = avgPace;
      const location = "Treadmill";
      const calories = Math.round(disconnectedData.calories ?? 0);
      const avg_pace = avgPace;
      const avg_heart_rate = avgHeartRate;
      // 新增速度 (小數一位)
      const speed = typeof disconnectedData.speed === "number" ? Number(disconnectedData.speed.toFixed(1)) : null;

      // 這裡會直接插入（參數建議要與supabase欄位一致）
      if (!user) return;
      try {
        const { supabase } = await import("@/integrations/supabase/client");
        await supabase
          .from('running_records')
          .insert([
            {
              user_id: user.id,
              duration,
              distance,
              pace,
              location,
              avg_pace,
              avg_heart_rate,
              calories,
              speed, // <-- 新增速度
            }
          ]);
      } catch (error) {
        console.error("保存跑步記錄失敗(cals):", error);
      }
      setIsSaving(false);
    },
    [dataHistoryRef, user]
  );

  return {
    handleSaveRecord,
    isSaving,
    ...rest,
  };
}
