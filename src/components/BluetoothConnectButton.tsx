
import React from 'react';
import { Button } from '@/components/ui/button';

interface BluetoothConnectButtonProps {
  connectedDevice: { connected: boolean } | null;
  isScanning: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

const BluetoothConnectButton: React.FC<BluetoothConnectButtonProps> = ({
  connectedDevice,
  isScanning,
  onConnect,
  onDisconnect,
}) => {
  return (
    <div className="flex gap-2">
      {connectedDevice ? (
        <Button
          onClick={onDisconnect}
          variant="outline"
          className="border-slate-600 text-slate-300 hover:bg-slate-700"
        >斷開連接</Button>
      ) : (
        <Button
          onClick={onConnect}
          disabled={isScanning}
          className="bg-blue-600 hover:bg-blue-700"
        >{isScanning ? '搜尋中...' : '連接設備'}</Button>
      )}
    </div>
  );
};
export default BluetoothConnectButton;
