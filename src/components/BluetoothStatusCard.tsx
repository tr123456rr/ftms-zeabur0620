
import React from 'react';
import { Bluetooth, BluetoothConnected, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { BluetoothDeviceInfo } from '@/hooks/useBluetoothFTMSTypes';

interface BluetoothStatusCardProps {
  isSupported: boolean;
  connectedDevice: BluetoothDeviceInfo | null;
}

const BluetoothStatusCard: React.FC<BluetoothStatusCardProps> = ({
  isSupported,
  connectedDevice
}) => {
  if (!isSupported) {
    return (
      <Card className="bg-slate-800 border-slate-700 p-6">
        <div className="flex items-center gap-3 text-red-400">
          <AlertCircle className="h-6 w-6" />
          <div>
            <h3 className="font-semibold">不支援 Web Bluetooth</h3>
            <p className="text-sm text-slate-400">
              請使用支援Web Bluetooth API的瀏覽器（如Chrome、Edge）
            </p>
          </div>
        </div>
      </Card>
    );
  }
  return (
    <Card className="bg-slate-800 border-slate-700 p-6">
      <div className="flex items-center gap-3">
        {connectedDevice ? (
          <BluetoothConnected className="h-6 w-6 text-blue-400" />
        ) : (
          <Bluetooth className="h-6 w-6 text-slate-400" />
        )}
        <div>
          <h3 className="font-semibold text-white">
            {connectedDevice ? connectedDevice.name : '藍芽 設備'}
          </h3>
          <p className="text-sm text-slate-400">
            {connectedDevice ? '已連接' : '未連接'}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default BluetoothStatusCard;

