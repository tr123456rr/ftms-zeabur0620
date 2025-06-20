import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FTMSTimeCard from './FTMSTimeCard';
import FTMSDistanceCard from './FTMSDistanceCard';
import FTMSPaceCard from './FTMSPaceCard';
import FTMSSpeedCard from './FTMSSpeedCard';
import FTMSCaloriesCard from './FTMSCaloriesCard';
import FTMSInclineCard from './FTMSInclineCard';
import FTMSHeartRateCard from './FTMSHeartRateCard';
import FTMSDataPanelMobileCards from "./FTMSDataPanelMobileCards";
import FTMSDataPanelDesktopCards from "./FTMSDataPanelDesktopCards";

interface FTMSData {
  time?: number;
  distance?: number;
  speed?: number;
  calories?: number;
  incline?: number;
  pace?: number;
  heartRate?: number;
}

interface FTMSDataPanelProps {
  bluetoothData?: FTMSData;
  isBluetoothConnected?: boolean;
}

const fallback = '--';

const FTMSDataPanel: React.FC<FTMSDataPanelProps> = ({
  bluetoothData,
  isBluetoothConnected = false
}) => {
  const [data, setData] = useState<FTMSData>({
    time: 0,
    distance: 0,
    speed: 0,
    calories: 0,
    incline: 0,
    pace: 0,
    heartRate: undefined
  });

  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);

  // 新增 state: 是否進入本地模擬
  const [isLocalSimulate, setIsLocalSimulate] = useState(false);

  // 藍牙連線有數據更新時，重設面板且關閉本地模擬
  useEffect(() => {
    if (bluetoothData && isBluetoothConnected) {
      setData(prevData => {
        const newData: FTMSData = {
          time:
            typeof bluetoothData.time === 'number' && !isNaN(bluetoothData.time) && bluetoothData.time > 0
              ? bluetoothData.time
              : undefined,
          distance:
            typeof bluetoothData.distance === 'number' && !isNaN(bluetoothData.distance)
              ? bluetoothData.distance
              : undefined,
          speed:
            typeof bluetoothData.speed === 'number' && !isNaN(bluetoothData.speed)
              ? bluetoothData.speed
              : undefined,
          calories:
            typeof bluetoothData.calories === 'number' && !isNaN(bluetoothData.calories)
              ? bluetoothData.calories
              : undefined,
          incline:
            typeof bluetoothData.incline === 'number' && !isNaN(bluetoothData.incline)
              ? bluetoothData.incline
              : undefined,
          pace:
            typeof bluetoothData.speed === 'number' && bluetoothData.speed > 0
              ? 60 / bluetoothData.speed
              : undefined,
          heartRate:
            typeof bluetoothData.heartRate === 'number' && !isNaN(bluetoothData.heartRate)
              ? bluetoothData.heartRate
              : undefined,
        };
        return newData;
      });
      setIsLocalSimulate(false); // 關閉模擬
      if (!isRunning && !startTime) {
        setIsRunning(true);
        setStartTime(Date.now());
      }
    }
  }, [bluetoothData, isBluetoothConnected, isRunning, startTime]);

  // 只有當 isRunning && isLocalSimulate (即手動啟動本地模擬) 才進行本地亂數增長
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && isLocalSimulate) {
      interval = setInterval(() => {
        setData(prevData => {
          const newTime = (prevData.time ?? 0) + 1;
          const newSpeed = 8 + Math.sin(newTime / 30) * 3 + Math.random() * 2;
          const newDistance = (prevData.distance ?? 0) + (newSpeed / 3600);
          const newCalories = (prevData.calories ?? 0) + (newSpeed * 0.8 / 3600);
          const newIncline = Math.max(0, 5 + Math.sin(newTime / 60) * 4);
          const newPace = newSpeed > 0 ? 60 / newSpeed : undefined;
          const newHeartRate = 100 + Math.floor(Math.sin(newTime / 30) * 8 + Math.random() * 5);
          return {
            time: newTime,
            distance: newDistance,
            speed: newSpeed,
            calories: newCalories,
            incline: newIncline,
            pace: newPace,
            heartRate: newHeartRate
          };
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, isLocalSimulate]);

  // 根據藍牙連線狀態切換本地模擬啟用/關閉
  useEffect(() => {
    if (!isBluetoothConnected) {
      // 只有在用戶手動啟動本地測試時才自動
      // 這裡可依業務需求，決定預設要不要自動進入模擬
      setIsLocalSimulate(false); // 禁止自動啟動模擬，僅保留面板靜止
      setIsRunning(false);
      setStartTime(null);
    } else {
      setIsLocalSimulate(false);
    }
  }, [isBluetoothConnected]);

  // 手動控制啟動（可自行增加一個按鈕讓使用者測試）
  const handleStartLocalSimulate = () => {
    setIsLocalSimulate(true);
    setIsRunning(true);
    setStartTime(Date.now());
  };

  const handleStartPause = () => {
    if (!isRunning && !startTime) {
      setStartTime(Date.now());
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setStartTime(null);
    setData({
      time: 0,
      distance: 0,
      speed: 0,
      calories: 0,
      incline: 0,
      pace: 0,
      heartRate: undefined
    });
    setIsLocalSimulate(false); // 重置時一併關閉模擬
  };

  return (
    <div className="space-y-6">
      {/* 行動裝置: 2+2+3 卡 三行 */}
      <div className="md:hidden">
        <FTMSDataPanelMobileCards data={data} />
      </div>
      {/* 桌面: 3+4 卡 二行 */}
      <div className="hidden md:block">
        <FTMSDataPanelDesktopCards data={data} />
      </div>
      {/* 連接狀態指示器 */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-full">
          <div className={`w-3 h-3 rounded-full ${
            isBluetoothConnected 
              ? "bg-green-500 animate-pulse" 
              : "bg-yellow-500 animate-pulse"
          }`} />
          <span className="text-slate-300">
            {isBluetoothConnected ? "FTMS 設備已連接" : "準備連接 FTMS 設備"}
          </span>
        </div>
        {/* <Button onClick={handleStartLocalSimulate}>啟動本地模擬</Button> */}
      </div>
    </div>
  );
};

export default FTMSDataPanel;
