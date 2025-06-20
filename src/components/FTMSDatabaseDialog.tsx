
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface RunningRecord {
  id: string;
  duration: number;
  distance: number;
  pace: string;
  avg_pace?: string | null;
  avg_heart_rate?: number | null;
  calories: number | null;
  created_at: string;
  speed?: number | null;
  // 其他db欄位
}

// mm:ss 格式 (若不正常則 --:--)
function formatAvgPace(pace: string | null | undefined): string {
  if (pace && /^\d+:\d{2}$/.test(pace)) return pace;
  return "--:--";
}

// 顯示速度，保留1位小數
function formatSpeed(speed: number | null | undefined): string {
  if (typeof speed === "number" && !isNaN(speed) && speed > 0) {
    return speed.toFixed(1);
  }
  return "--";
}

// 由 avg_pace 推算平均速度（如果有存；否則以 總距離/總時間 推算）
function calcAvgSpeedKmHFromPaceAndRecord(avg_pace: string | null | undefined, duration: number, distance: number): string {
  // 有 avg_pace，且格式正確
  if (avg_pace && /^\d+:\d{2}$/.test(avg_pace)) {
    const [min, sec] = avg_pace.split(":").map(Number);
    const minPerKm = min + sec / 60;
    if (minPerKm > 0) {
      const speed = 60 / minPerKm;
      return speed > 0 && speed < 50 ? speed.toFixed(1) : "--";
    }
    return "--";
  }
  // 沒有 pace，fallback 用距離/時間
  if (typeof duration === "number" && typeof distance === "number" && duration > 0 && distance > 0) {
    const hours = duration / 3600;
    const speed = distance / hours;
    return speed > 0 && speed < 50 ? speed.toFixed(1) : "--";
  }
  return "--";
}

function displayAvgHeartRate(r: RunningRecord) {
  if (typeof r.avg_heart_rate === "number" && r.avg_heart_rate > 0) return r.avg_heart_rate;
  return "--";
}

const FTMSDatabaseDialog: React.FC<{
  open: boolean;
  records: RunningRecord[];
  loading: boolean;
  onClose: () => void;
  onRefresh: () => void;
}> = ({
  open, records, loading, onClose, onRefresh
}) => {
  React.useEffect(() => {
    if (open) onRefresh();
    // eslint-disable-next-line
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>雲端運動數據紀錄</DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className="p-8 text-center text-slate-400">讀取中...</div>
        ) : (
          <div className="overflow-auto flex-1">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>日期</TableHead>
                  <TableHead>時間（秒）</TableHead>
                  <TableHead>距離（km）</TableHead>
                  <TableHead>速度（km/h）</TableHead>
                  <TableHead>平均步伐 (min/km)</TableHead>
                  <TableHead>卡路里</TableHead>
                  <TableHead>平均速度 (km/h)</TableHead>
                  <TableHead>平均心律 (bpm)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-slate-500">沒有資料</TableCell>
                  </TableRow>
                ) : records.map(r => (
                  <TableRow key={r.id}>
                    <TableCell>{new Date(r.created_at).toLocaleString()}</TableCell>
                    <TableCell>{r.duration}</TableCell>
                    <TableCell>{Number(r.distance).toFixed(2)}</TableCell>
                    <TableCell>{formatSpeed(r.speed)}</TableCell>
                    <TableCell>{formatAvgPace(r.avg_pace)}</TableCell>
                    <TableCell>{r.calories ?? "--"}</TableCell>
                    <TableCell>
                      {calcAvgSpeedKmHFromPaceAndRecord(r.avg_pace, r.duration, Number(r.distance))}
                    </TableCell>
                    <TableCell>{displayAvgHeartRate(r)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        <DialogFooter>
          <Button onClick={onRefresh} variant="secondary">重新整理</Button>
          <Button onClick={onClose}>關閉</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FTMSDatabaseDialog;
