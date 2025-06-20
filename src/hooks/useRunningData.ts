
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// 用外部 user 傳入 hook
interface RunningRecord {
  id: string;
  duration: number;
  distance: number;
  pace: string;
  avg_pace?: string | null;
  avg_heart_rate?: number | null;
  calories: number | null;
  location: string;
  created_at: string;
  // 其他欄位請自行加入
}

interface User {
  id: string;
  email?: string;
  [key: string]: any;
}

export const useRunningData = (user: User | null) => {
  const [records, setRecords] = useState<RunningRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchRecords = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('running_records')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecords(data || []);
    } catch (error) {
      console.error('獲取跑步記錄失敗:', error);
      toast({
        title: '錯誤',
        description: '無法獲取跑步記錄',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // 新版 saveRecord 支援 avg_pace, avg_heart_rate
  const saveRecord = async (
    duration: number,
    distance: number,
    pace: string,
    location: string,
    avg_pace?: string,
    avg_heart_rate?: number
  ) => {
    if (!user) {
      toast({
        title: '錯誤',
        description: '請先登入才能保存記錄',
        variant: 'destructive',
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('running_records')
        .insert([
          {
            user_id: user.id,
            duration,
            distance,
            pace,
            location,
            avg_pace: avg_pace ?? pace,
            avg_heart_rate: avg_heart_rate ?? null,
            calories: 0,
          }
        ]);

      if (error) throw error;

      toast({
        title: '成功',
        description: '跑步記錄已保存到雲端',
      });

      fetchRecords();
      return true;
    } catch (error) {
      console.error('保存跑步記錄失敗:', error);
      toast({
        title: '錯誤',
        description: '保存跑步記錄失敗',
        variant: 'destructive',
      });
      return false;
    }
  };

  const getMonthlyStats = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyRecords = records.filter(record => {
      const recordDate = new Date(record.created_at);
      return recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear;
    });

    const totalRuns = monthlyRecords.length;
    const totalDistance = monthlyRecords.reduce((sum, record) => sum + record.distance, 0);
    const totalTime = monthlyRecords.reduce((sum, record) => sum + record.duration, 0);

    const formatTime = (seconds: number) => {
      const hrs = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const avgPace = totalDistance > 0 ? (totalTime / 60) / totalDistance : 0; // 時間(分)/距離(km)

    return {
      totalRuns,
      totalDistance: Number(totalDistance.toFixed(1)),
      totalTime: formatTime(totalTime),
      avgPace: `${Math.floor(avgPace)}:${Math.round((avgPace % 1) * 60).toString().padStart(2, '0')}`,
    };
  };

  useEffect(() => {
    fetchRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return {
    records,
    loading,
    saveRecord,
    getMonthlyStats,
    fetchRecords
  };
};
