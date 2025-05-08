import { useState, useEffect } from 'react';

/**
 * @function useGeoLocation
 * @description A custom hook that retrieves the current geographic location (latitude and longitude) of the user.
 * It tracks the loading state and any errors that occur during the geolocation request.
 *
 * @returns {UseGeoLocationResponse} The hook returns the current location status, including:
 *   - `location`: The user's geographic location with latitude and longitude (or `null` if not retrieved).
 *   - `loading`: A boolean indicating whether the geolocation request is still in progress.
 *   - `error`: A string representing any error message encountered during the geolocation retrieval.
 *
 * @example
 * const { location, loading, error } = useGeoLocation();
 */
interface GeoLocation {
  latitude: number; // The latitude of the current location.
  longitude: number; // The longitude of the current location.
}

interface UseGeoLocationResponse {
  location: GeoLocation | null; // The current location, or null if not available.
  loading: boolean; // Whether the geolocation request is still in progress.
  error: string | null; // Error message or null if no error.
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
  }, []);

  return { location, loading, error };
};
