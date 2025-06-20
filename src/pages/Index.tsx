
import React from "react";
import FTMSHeader from "@/components/FTMSHeader";
import FTMSWelcome from "@/components/FTMSWelcome";
import FTMSDataPanel from "@/components/FTMSDataPanel";
import BluetoothFTMS from "@/components/BluetoothFTMS";
import FTMSSaveDialog from "@/components/FTMSSaveDialog";
import { useFTMSMainPage } from "@/hooks/useFTMSMainPage";

const Index = () => {
  const {
    user,
    setShowAuthModal,
    showAuthModal,
    ftmsData,
    isBluetoothConnected,
    showSaveDialog,
    disconnectedData,
    isSaving,
    handleAuthSuccess,
    handleLogout,
    handleFTMSDataReceived,
    handleDisconnected,
    handleSaveRecord,
    handleCancelSave,
    getAverageStats
  } = useFTMSMainPage();

  // 安全 destruct（可避免 undefined 的錯誤）
  const { avgSpeed = undefined, avgPace = undefined, avgIncline = undefined, avgHeartRate = undefined } =
    (getAverageStats ? getAverageStats() : {});

  // 1. 丟給 Dialog 的 onSave 包裝一次（確保「資料儲存」後自動關閉 Dialog）
  const handleDialogSave = async () => {
    await handleSaveRecord?.();
    handleCancelSave();
  };

  if (!user) {
    return (
      <FTMSWelcome
        showAuthModal={showAuthModal}
        setShowAuthModal={setShowAuthModal}
        onAuthSuccess={handleAuthSuccess}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <FTMSHeader userName={user.name} onLogout={handleLogout} />
      <main className="p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <BluetoothFTMS
            onDataReceived={handleFTMSDataReceived}
            onDisconnected={handleDisconnected}
          />
          <FTMSDataPanel
            bluetoothData={ftmsData}
            isBluetoothConnected={isBluetoothConnected}
          />
        </div>
      </main>
      <FTMSSaveDialog
        open={showSaveDialog}
        recordData={{
          ...disconnectedData,
          avgSpeed,
          avgPace,
          avgIncline,
          avgHeartRate,
        }}
        onCancel={handleCancelSave}
        onSave={handleDialogSave}
        saving={isSaving}
      />
    </div>
  );
};

export default Index;

