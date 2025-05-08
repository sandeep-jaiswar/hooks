import { useState, useEffect } from 'react';

interface GeoLocation {
  latitude: number;
  longitude: number;
}

interface UseGeoLocationResponse {
  location: GeoLocation | null;
  loading: boolean;
  error: string | null;
}

export const useGeoLocation = (): UseGeoLocationResponse => {
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const successCallback = (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;
      setLocation({ latitude, longitude });
      setLoading(false);
    };

    const errorCallback = (err: GeolocationPositionError) => {
      setError(err.message);
      setLoading(false);
    };

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    } else {
      setError('Geolocation is not supported by this browser.');
      setLoading(false);
    }

    return () => {
      // Clean up if needed, for example, to stop watching position if used
    };
  }, []);

  return { location, loading, error };
};
