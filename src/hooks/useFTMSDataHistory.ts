
import { useRef, useCallback, useEffect, useState } from "react";

export interface FTMSData {
  speed?: number;
  averageSpeed?: number;
  distance?: number;
  incline?: number;
  elevation?: number;
  calories?: number;
  time?: number;
  heartRate?: number;
  // 新增
  pace?: number; // min/km
}

export function useFTMSDataHistory() {
  const [ftmsData, setFtmsData] = useState<FTMSData | undefined>(undefined);
  const [isBluetoothConnected, setIsBluetoothConnected] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [disconnectedData, setDisconnectedData] = useState<FTMSData | undefined>(undefined);

  const dataHistoryRef = useRef<FTMSData[]>([]);

  useEffect(() => {
    if (isBluetoothConnected) {
      dataHistoryRef.current = [];
    }
  }, [isBluetoothConnected]);

  const handleFTMSDataReceived = useCallback((data: FTMSData) => {
    setFtmsData(data);
    setIsBluetoothConnected(true);
    if (data.time && data.time > 0) {
      // 計算 pace
      const pace = (typeof data.speed === "number" && data.speed > 0)
        ? 60 / data.speed
        : undefined;
      dataHistoryRef.current.push({
        speed: data.speed,
        distance: data.distance,
        incline: data.incline,
        heartRate: data.heartRate,
        time: data.time,
        pace, // 新增
      });
    }
  }, []);

  const handleDisconnected = useCallback(() => {
    setIsBluetoothConnected(false);
  }, []);

  useEffect(() => {
    if (!isBluetoothConnected && ftmsData && ftmsData.time && ftmsData.distance && ftmsData.time > 0) {
      // 斷線時也把 pace 併進 disconnectedData
      const pace = (typeof ftmsData.speed === "number" && ftmsData.speed > 0)
        ? 60 / ftmsData.speed
        : undefined;
      setDisconnectedData({ ...ftmsData, pace });
      setShowSaveDialog(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBluetoothConnected]);

  const handleCancelSave = () => {
    setShowSaveDialog(false);
    setDisconnectedData(undefined);
  };

  // 計算平均功能，加上平均步伐（分/km，根據平均速度）
  const getAverageStats = () => {
    const history = dataHistoryRef.current;
    const speedSum = history.reduce((sum, d) => sum + (typeof d.speed === "number" ? d.speed : 0), 0);
    const speedCount = history.filter((d) => typeof d.speed === "number").length;
    const avgSpeed = speedCount > 0 ? speedSum / speedCount : undefined;

    const hrSum = history.reduce((sum, d) => sum + (typeof d.heartRate === "number" ? d.heartRate : 0), 0);
    const hrCount = history.filter((d) => typeof d.heartRate === "number").length;
    const avgHeartRate = hrCount > 0 ? Math.round(hrSum / hrCount) : undefined;

    const inclineSum = history.reduce((sum, d) => sum + (typeof d.incline === "number" ? d.incline : 0), 0);
    const inclineCount = history.filter((d) => typeof d.incline === "number").length;
    const avgIncline = inclineCount > 0 ? inclineSum / inclineCount : undefined;

    // 平均步伐（分/km）：如果 avgSpeed 有效且大於0
    const avgPace = avgSpeed && avgSpeed > 0 ? (60 / avgSpeed) : undefined;

    return { avgSpeed, avgPace, avgIncline, avgHeartRate };
  };

  const getLatestData = () => ftmsData;

  const getHistory = () => dataHistoryRef.current;

  return {
    ftmsData,
    isBluetoothConnected,
    showSaveDialog,
    disconnectedData,
    dataHistoryRef,
    setShowSaveDialog,
    setDisconnectedData,
    handleFTMSDataReceived,
    handleDisconnected,
    handleCancelSave,
    getAverageStats,
    getLatestData,
    getHistory,
  };
}

