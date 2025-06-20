
import React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

interface RecordData {
  time?: number;
  distance?: number;
  speed?: number;
  calories?: number;
  incline?: number;
  pace?: number;
  heartRate?: number;
  avgSpeed?: number;
  avgPace?: number;
  avgIncline?: number;
  avgHeartRate?: number;
}

interface FTMSSaveDialogProps {
  open: boolean;
  onCancel: () => void;
  onSave: () => void;
  recordData?: RecordData;
  saving?: boolean;
}

const fallback = "--";

const formatPace = (pace?: number): string => {
  if (pace === undefined || pace === null || isNaN(pace) || pace === 0) return fallback;
  const minutes = Math.floor(pace);
  const seconds = Math.round((pace % 1) * 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const FTMSSaveDialog: React.FC<FTMSSaveDialogProps> = ({
  open,
  onCancel,
  onSave,
  recordData,
  saving,
}) => {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>儲存運動數據?</AlertDialogTitle>
          <AlertDialogDescription>
            {typeof recordData?.time === "number" && recordData.time > 0 ? (
              <div className="mb-2 text-slate-500">
                <div>時間：{Math.floor((recordData.time ?? 0)/60)}分{(recordData.time ?? 0) % 60}秒</div>
                <div>距離：{(recordData.distance ?? 0).toFixed(2)} 公里</div>
                <div>
                  速度：{(recordData.speed ?? 0).toFixed(1)} km/h
                  <span className="text-xs text-slate-400 ml-2">
                    (平均: {(recordData.avgSpeed ?? 0).toFixed(1)} km/h)
                  </span>
                </div>
                <div>
                  步伐：{recordData.pace !== undefined && recordData.pace !== null ? formatPace(recordData.pace) + " min/km" : `${fallback} min/km`}
                  <span className="text-xs text-slate-400 ml-2">
                    (平均: {formatPace(recordData.avgPace)} min/km)
                  </span>
                </div>
                <div>卡路里：{Math.round(recordData.calories ?? 0)} kcal</div>
                <div>
                  坡度：{(recordData.incline ?? 0).toFixed(1)}%
                  <span className="text-xs text-slate-400 ml-2">
                    (平均: {(recordData.avgIncline ?? 0).toFixed(1)}%)
                  </span>
                </div>
                <div>
                  心律：{recordData.heartRate ?? fallback} bpm
                  <span className="text-xs text-slate-400 ml-2">
                    (平均: {recordData.avgHeartRate ?? fallback} bpm)
                  </span>
                </div>
              </div>
            ) : (
              <div>尚無有效數據</div>
            )}
            您的設備已離線，是否要將本次運動數據儲存到雲端？
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel} disabled={saving}>
            不要儲存
          </AlertDialogCancel>
          <AlertDialogAction onClick={onSave} disabled={saving}>
            {saving ? "儲存中..." : "儲存數據"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default FTMSSaveDialog;

