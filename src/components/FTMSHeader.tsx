
import React, { useState } from "react";
import { LogOut, Settings, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import FTMSDatabaseDialog from "./FTMSDatabaseDialog";
import { supabase } from "@/integrations/supabase/client";

interface FTMSHeaderProps {
  userName: string;
  onLogout: () => void;
}

const FTMSHeader: React.FC<FTMSHeaderProps> = ({ userName, onLogout }) => {
  const [dbOpen, setDbOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState([]);
  // 可考慮管理錯誤訊息

  const fetchRecords = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("running_records")
      .select("*")
      .order("created_at", { ascending: false });
    setRecords(data || []);
    setLoading(false);
    if (error) console.error("讀取運動數據資料錯誤", error);
  };

  const handleOpenDb = () => setDbOpen(true);
  const handleCloseDb = () => setDbOpen(false);

  return (
    <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-bold text-cyan-400">健身數據面板</h1>
        <div className="flex items-center gap-4">
          <span className="text-slate-300">歡迎，{userName}</span>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white" onClick={handleOpenDb}>
              <Database className="h-4 w-4" />
            </Button>
            <Button onClick={onLogout} variant="ghost" size="sm" className="text-slate-300 hover:text-white">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <FTMSDatabaseDialog
        open={dbOpen}
        onClose={handleCloseDb}
        records={records}
        loading={loading}
        onRefresh={fetchRecords}
      />
    </header>
  );
};

export default FTMSHeader;
