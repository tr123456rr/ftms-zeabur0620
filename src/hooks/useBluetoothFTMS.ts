import { useState, useCallback, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import type { BluetoothDeviceInfo, FTMSData } from "./useBluetoothFTMSTypes";
import { parseFTMSData } from "./useBluetoothFTMSUtils";

const FTMS_SERVICE_UUID = '00001826-0000-1000-8000-00805f9b34fb';
const TREADMILL_DATA_CHARACTERISTIC = '00002acd-0000-1000-8000-00805f9b34fb';

export function useBluetoothFTMS(
  onDataReceived?: (data: FTMSData) => void,
  onDisconnected?: () => void,
) {
  const [isScanning, setIsScanning] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState<BluetoothDeviceInfo | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  const [startTime, setStartTime] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!navigator.bluetooth) {
      setIsSupported(false);
      toast({
        title: "不支援 Bluetooth",
        description: "您的瀏覽器不支援Web Bluetooth API",
        variant: "destructive"
      });
    }
  }, [toast]);

  const handleFTMSData = useCallback((event: Event) => {
    const target = event.target as any;
    const value: DataView = target.value;
    if (!value) return;
    parseFTMSData(value, (data) => {
      if (onDataReceived) onDataReceived(data);
    });
  }, [onDataReceived]);

  // ❶ 断線處理 handler：多通知外部
  const handleDisconnected = useCallback((event: Event) => {
    const device = event.target as any;
    setConnectedDevice(null);
    setStartTime(null);
    if (onDisconnected) onDisconnected();
    toast({
      title: "藍牙已斷線",
      description: `已與 ${device?.name || 'FTMS設備'} 斷開連接，請重新連線。`,
      variant: "destructive",
    });
    console.warn(`Bluetooth device "${device?.name}" disconnected.`);
  }, [toast, onDisconnected]);

  const scanForDevices = useCallback(async () => {
    if (!navigator.bluetooth) {
      toast({
        title: "Bluetooth 不可用",
        description: "請確保您的瀏覽器支援Web Bluetooth API",
        variant: "destructive"
      });
      return;
    }
    setIsScanning(true);
    try {
      console.log('開始掃描 FTMS 設備...');
      const device = await navigator.bluetooth.requestDevice({
        filters: [
          { services: [FTMS_SERVICE_UUID] },
          { namePrefix: 'Treadmill' },
          { namePrefix: 'FTMS' },
          { namePrefix: 'Fitness' }
        ],
        optionalServices: [FTMS_SERVICE_UUID]
      });
      console.log('找到設備:', device.name, 'ID:', device.id);

      // ❷ 綁定斷線事件監聽器
      device.removeEventListener('gattserverdisconnected', handleDisconnected as EventListener);
      device.addEventListener('gattserverdisconnected', handleDisconnected as EventListener);

      // ❸ 檢查連線狀態，在需要時重新連線
      const server = device.gatt?.connected 
        ? device.gatt 
        : await device.gatt?.connect();
      if (!server) throw new Error('無法連接到GATT服務器');
      console.log('已連接到GATT服務器');

      const service = await server.getPrimaryService(FTMS_SERVICE_UUID);
      console.log('已獲取FTMS服務');
      setStartTime(Date.now());

      try {
        const characteristic = await service.getCharacteristic(TREADMILL_DATA_CHARACTERISTIC);
        console.log('已獲取跑步機數據特徵');
        await characteristic.startNotifications();
        characteristic.addEventListener('characteristicvaluechanged', handleFTMSData);
      } catch (charError) {
        console.warn('無法獲取跑步機數據特徵:', charError);
      }

      setConnectedDevice({
        id: device.id,
        name: device.name || '藍芽 設備',
        connected: true
      });

      toast({
        title: "連接成功",
        description: `已成功連接到 ${device.name || '藍芽 設備'}`,
      });

    } catch (error) {
      console.error('藍牙連接錯誤:', error);
      let errorMessage = "無法連接到FTMS設備";
      if (error instanceof Error) {
        if (error.message.includes('GATT Server is disconnected')) {
          errorMessage = "設備已斷線，請重新開啟設備電源或藍牙後再嘗試連線。";
        } else if (error.message.includes('User cancelled')) {
          errorMessage = "用戶取消了設備選擇";
        } else if (error.message.includes('No devices found')) {
          errorMessage = "找不到FTMS設備，請確保設備已開啟且在範圍內";
        } else {
          errorMessage = `連接失敗: ${error.message}`;
        }
      }
      toast({
        title: "連接失敗",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
    }
  }, [toast, handleDisconnected, handleFTMSData]);

  const disconnect = useCallback(async () => {
    if (connectedDevice) {
      setConnectedDevice(null);
      setStartTime(null);
      if (onDisconnected) onDisconnected();
      toast({
        title: "已斷開連接",
        description: "已與FTMS設備斷開連接",
      });
    }
  }, [connectedDevice, toast, onDisconnected]);

  return {
    isScanning,
    connectedDevice,
    isSupported,
    scanForDevices,
    disconnect,
  };
}
