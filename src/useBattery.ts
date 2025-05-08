import { useState, useEffect } from 'react';

interface BatteryManager {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
  addEventListener(
    event: 'chargingchange' | 'levelchange' | 'chargingtimechange' | 'dischargingtimechange',
    callback: EventListener
  ): void;
  removeEventListener(
    event: 'chargingchange' | 'levelchange' | 'chargingtimechange' | 'dischargingtimechange',
    callback: EventListener
  ): void;
}

interface BatteryStatus {
  isCharging: boolean;
  level: number;
  chargingTime: number | null;
  dischargingTime: number | null;
}

export const useBattery = (): BatteryStatus | undefined => {
  const [battery, setBattery] = useState<BatteryStatus | undefined>(undefined);

  useEffect(() => {
    const updateBatteryStatus = (battery: BatteryManager) => {
      setBattery({
        isCharging: battery.charging,
        level: battery.level,
        chargingTime: battery.chargingTime,
        dischargingTime: battery.dischargingTime,
      });
    };

    if ('getBattery' in navigator) {
      // @ts-ignore - TypeScript might not recognize the 'getBattery' method properly
      navigator.getBattery().then((battery) => {
        updateBatteryStatus(battery);

        battery.addEventListener('chargingchange', () => updateBatteryStatus(battery));
        battery.addEventListener('levelchange', () => updateBatteryStatus(battery));
        battery.addEventListener('chargingtimechange', () => updateBatteryStatus(battery));
        battery.addEventListener('dischargingtimechange', () => updateBatteryStatus(battery));
      });
    }

    return () => {
      if ('getBattery' in navigator) {
        // @ts-ignore
        navigator.getBattery().then((battery) => {
          battery.removeEventListener('chargingchange', () => updateBatteryStatus(battery));
          battery.removeEventListener('levelchange', () => updateBatteryStatus(battery));
          battery.removeEventListener('chargingtimechange', () => updateBatteryStatus(battery));
          battery.removeEventListener('dischargingtimechange', () => updateBatteryStatus(battery));
        });
      }
    };
  }, []);

  return battery;
};
