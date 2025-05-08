import { useEffect, useState } from 'react';

/**
 * @interface BatteryManager
 * Represents the battery status and provides event listeners
 * for battery-related changes.
 */
interface BatteryManager extends EventTarget {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
  addEventListener<K extends keyof BatteryManagerEventMap>(
    type: K,
    listener: (this: BatteryManager, ev: Event) => unknown,
    options?: boolean | AddEventListenerOptions
  ): void;
  removeEventListener<K extends keyof BatteryManagerEventMap>(
    type: K,
    listener: (this: BatteryManager, ev: Event) => unknown,
    options?: boolean | EventListenerOptions
  ): void;
}

/**
 * @typedef {Object} BatteryManagerEventMap
 * @property {Event} chargingchange - Fired when the charging state changes.
 * @property {Event} chargingtimechange - Fired when the charging time changes.
 * @property {Event} dischargingtimechange - Fired when the discharging time changes.
 * @property {Event} levelchange - Fired when the battery level changes.
 */
interface BatteryManagerEventMap {
  chargingchange: Event;
  chargingtimechange: Event;
  dischargingtimechange: Event;
  levelchange: Event;
}

/**
 * @interface BatteryNavigator
 * Extends the Navigator API to optionally include the getBattery function.
 */
interface BatteryNavigator extends Navigator {
  getBattery?: () => Promise<BatteryManager>;
}

/**
 * @typedef {Object} BatteryStatus
 * @property {boolean} isCharging - Whether the device is currently charging.
 * @property {number} level - Battery level between 0 and 1.
 * @property {number} chargingTime - Time in seconds until battery is fully charged.
 * @property {number} dischargingTime - Time in seconds until battery is empty.
 */
interface BatteryStatus {
  isCharging: boolean;
  level: number;
  chargingTime: number;
  dischargingTime: number;
}

/**
 * @function useBattery
 * @description Custom React hook to monitor the device's battery status using the Battery Status API.
 * @returns {BatteryStatus | null} Returns the current battery status or null if unsupported.
 */
export const useBattery = (): BatteryStatus | null => {
  const [status, setStatus] = useState<BatteryStatus | null>(null);

  useEffect(() => {
    let battery: BatteryManager | null = null;

    const updateBatteryStatus = () => {
      if (!battery) return;
      setStatus({
        isCharging: battery.charging,
        level: battery.level,
        chargingTime: battery.chargingTime,
        dischargingTime: battery.dischargingTime,
      });
    };

    const handleChange = () => updateBatteryStatus();

    const addListeners = (b: BatteryManager) => {
      b.addEventListener('chargingchange', handleChange);
      b.addEventListener('levelchange', handleChange);
      b.addEventListener('chargingtimechange', handleChange);
      b.addEventListener('dischargingtimechange', handleChange);
    };

    const removeListeners = (b: BatteryManager) => {
      b.removeEventListener('chargingchange', handleChange);
      b.removeEventListener('levelchange', handleChange);
      b.removeEventListener('chargingtimechange', handleChange);
      b.removeEventListener('dischargingtimechange', handleChange);
    };

    const batteryApi = (navigator as BatteryNavigator).getBattery;

    if (typeof batteryApi === 'function') {
      batteryApi.call(navigator).then((batt) => {
        battery = batt;
        updateBatteryStatus();
        addListeners(battery);
      });
    }

    return () => {
      if (battery) {
        removeListeners(battery);
      }
    };
  }, []);

  return status;
};
