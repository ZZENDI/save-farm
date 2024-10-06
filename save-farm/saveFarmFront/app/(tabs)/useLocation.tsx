import { useState, useEffect } from 'react';

interface LocationData {
  latitude: number;
  longitude: number;
}

export const useLocation = () => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getLocation = () => {
      if (!navigator.geolocation) {
        setError('이 브라우저는 Geolocation을 지원하지 않습니다.');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (err) => {
          setError('위치를 가져오는 데 오류가 발생했습니다.');
          console.error(err);
        }
      );
    };

    getLocation();
  }, []);

  return { location, error };
};
