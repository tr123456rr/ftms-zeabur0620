
import { useFTMSUser } from "./useFTMSUser";
import { useFTMSDataHistory } from "./useFTMSDataHistory";
import { useFTMSSaveRecord } from "./useFTMSSaveRecord";

export function useFTMSMainPage() {
  const {
    user,
    setShowAuthModal,
    showAuthModal,
    handleAuthSuccess,
    handleLogout,
  } = useFTMSUser();

  const {
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
  } = useFTMSDataHistory();

  const {
    handleSaveRecord,
    isSaving,
    ...restRunningData
  } = useFTMSSaveRecord(user, dataHistoryRef);

  // 將 handleSaveRecord 用於 UI 時得帶最新的 disconnectedData
  const onSave = () => handleSaveRecord(disconnectedData);

  return {
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
    handleSaveRecord: onSave,
    handleCancelSave,
    getAverageStats,
    ...restRunningData,
  };
}
