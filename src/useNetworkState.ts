import { useEffect, useState } from 'react';

/**
 * Types for the Network Information API.
 */
interface NetworkInformation extends EventTarget {
  effectiveType?: 'slow-2g' | '2g' | '3g' | '4g' | string;
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
  type?: string;
  onchange?: () => void;
}

interface ExtendedNavigator extends Navigator {
  connection?: NetworkInformation;
}

/**
 * Represents the current state of the network.
 */
interface NetworkState {
  online: boolean;
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
  type?: string;
}

/**
 * `useNetworkState` is a React hook that provides real-time network connectivity information.
 * It tracks online/offline status, connection speed/type, and more.
 *
 * @returns {NetworkState} - The current network state.
 *
 * @example
 * const network = useNetworkState();
 * console.log(network.online); // true/false
 */
export function useNetworkState(): NetworkState {
  const getConnectionInfo = (): Partial<NetworkState> => {
    if (typeof navigator === 'undefined') return {};
    const connection = (navigator as ExtendedNavigator).connection;
    return {
      effectiveType: connection?.effectiveType,
      downlink: connection?.downlink,
      rtt: connection?.rtt,
      saveData: connection?.saveData,
      type: connection?.type,
    };
  };

  const getInitialState = (): NetworkState => ({
    online: typeof navigator !== 'undefined' ? navigator.onLine : true,
    ...getConnectionInfo(),
  });

  const [state, setState] = useState<NetworkState>(getInitialState);

  useEffect(() => {
    const updateOnlineStatus = () => {
      setState((prev) => ({ ...prev, online: navigator.onLine }));
    };

    const updateConnection = () => {
      setState((prev) => ({ ...prev, ...getConnectionInfo() }));
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    const connection = (navigator as ExtendedNavigator).connection;
    connection?.addEventListener('change', updateConnection);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
      connection?.removeEventListener('change', updateConnection);
    };
  }, []);

  return state;
}
