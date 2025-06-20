
export interface BluetoothDeviceInfo {
  id: string;
  name: string;
  connected: boolean;
}

export interface FTMSData {
  speed?: number;
  averageSpeed?: number;
  distance?: number;
  incline?: number;
  elevation?: number;
  calories?: number;
  time?: number;
  heartRate?: number;  // 新增心律（bpm）
}
