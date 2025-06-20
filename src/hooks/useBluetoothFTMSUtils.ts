import type { FTMSData } from "./useBluetoothFTMSTypes";

export const getUint24 = (dataView: DataView, byteOffset: number, littleEndian: boolean = true): number => {
  if (littleEndian) {
    return dataView.getUint8(byteOffset) |
      (dataView.getUint8(byteOffset + 1) << 8) |
      (dataView.getUint8(byteOffset + 2) << 16);
  } else {
    return (dataView.getUint8(byteOffset) << 16) |
      (dataView.getUint8(byteOffset + 1) << 8) |
      dataView.getUint8(byteOffset + 2);
  }
};

export function parseFTMSData(
  value: DataView,
  onData: (d: FTMSData) => void
) {
  const flags = value.getUint16(0, true);
  let nextPosition = 4;

  let posAvgSpeed, posTotDistance, posInclination, posElevGain, posInsPace, posAvgPace;
  let posKcal, posHR, posMET, posElapsedTime;

  if ((flags & (1 << 1)) !== 0)      { posAvgSpeed    = nextPosition; nextPosition += 2; }
  if ((flags & (1 << 2)) !== 0)      { posTotDistance = nextPosition; nextPosition += 3; }
  if ((flags & (1 << 3)) !== 0)      { posInclination = nextPosition; nextPosition += 4; }
  if ((flags & (1 << 4)) !== 0)      { posElevGain    = nextPosition; nextPosition += 4; }
  if ((flags & (1 << 5)) !== 0)      { posInsPace     = nextPosition; nextPosition += 1; }
  if ((flags & (1 << 6)) !== 0)      { posAvgPace     = nextPosition; nextPosition += 1; }
  if ((flags & (1 << 7)) !== 0)      { posKcal        = nextPosition; nextPosition += 5; }
  if ((flags & (1 << 8)) !== 0)      { posHR          = nextPosition; nextPosition += 1; }
  if ((flags & (1 << 9)) !== 0)      { posMET         = nextPosition; nextPosition += 1; }
  if ((flags & (1 << 10)) !== 0)     { posElapsedTime = nextPosition; nextPosition += 2; }

  const bufferArr = [];
  for (let i = 0; i < value.byteLength; i++) bufferArr.push(value.getUint8(i));
  console.log('FTMS DataView buffer:', bufferArr);
  console.log('FTMS flags:', flags.toString(2).padStart(16, '0'), 'raw:', flags);

  const data: FTMSData = {};

  const speedRaw = value.getUint16(2, true);
  data.speed = speedRaw / 100;
  console.log('解析 speed:', data.speed?.toFixed(2), 'km/h');

  if (typeof posAvgSpeed !== "undefined") {
    const avgSpeedRaw = value.getUint16(posAvgSpeed, true);
    data.averageSpeed = avgSpeedRaw / 100;
    console.log('解析 avgSpeed:', data.averageSpeed?.toFixed(2), 'km/h');
  }

  if (typeof posTotDistance !== "undefined") {
    const dist = value.getUint16(posTotDistance, true);
    const distComp = value.getUint8(posTotDistance + 2);
    data.distance = ((dist + (distComp << 16)) / 1000); // 公里
    console.log('解析 distance:', data.distance?.toFixed(3), 'km');
  }

  if (typeof posInclination !== "undefined") {
    const inclination = value.getInt16(posInclination, true) / 10;
    data.incline = inclination;
    console.log('解析 incline:', data.incline?.toFixed(2), '%');
  }

  if (typeof posKcal !== "undefined") {
    const kcal = value.getUint16(posKcal, true);
    data.calories = kcal;
    console.log('解析 calories:', data.calories, 'kcal');
  }

  if (typeof posElapsedTime !== "undefined") {
    let elapsed = value.getUint16(posElapsedTime, true);
    data.time = (elapsed === 0x7FFF ? 0 : elapsed); // invalid 特判
    console.log('解析 elapsed time:', data.time, 's');
  } else {
    data.time = undefined;
    console.log('BLE資料未帶 time 欄位');
  }

  if (typeof posHR !== "undefined") {
    const heartRateRaw = value.getUint8(posHR);
    data.heartRate = heartRateRaw;
    console.log('解析 heartRate:', data.heartRate, 'bpm');
  }

  console.log('最終 FTMS數據:', data, '| 解析完 offset:', nextPosition);

  onData(data);
}
