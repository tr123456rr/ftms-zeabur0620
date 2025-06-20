
import React from 'react';
import { useBluetoothFTMS } from '@/hooks/useBluetoothFTMS';
import { FTMSData } from '@/hooks/useBluetoothFTMSTypes';
import BluetoothStatusCard from './BluetoothStatusCard';
import BluetoothConnectButton from './BluetoothConnectButton';

interface BluetoothFTMSProps {
  onDataReceived?: (data: FTMSData) => void;
  onDisconnected?: () => void;
}

const BluetoothFTMS: React.FC<BluetoothFTMSProps> = ({ onDataReceived, onDisconnected }) => {
  const {
    isScanning,
    connectedDevice,
    isSupported,
    scanForDevices,
    disconnect,
  } = useBluetoothFTMS((data) => {
    if (onDataReceived) onDataReceived(data);
  }, onDisconnected);

  return (
    <div>
      <div className="flex items-center justify-between">
        <BluetoothStatusCard
          isSupported={isSupported}
          connectedDevice={connectedDevice}
        />
        <BluetoothConnectButton
          connectedDevice={connectedDevice}
          isScanning={isScanning}
          onConnect={scanForDevices}
          onDisconnect={disconnect}
        />
      </div>
    </div>
  );
};

export default BluetoothFTMS;
