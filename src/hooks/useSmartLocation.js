import { useEffect, useRef, useState } from "react";
import { calculateDistance } from "../utils/calculateDistance";
import { DISTANCE_THRESHOLD, INTERVAL_TIME } from "../constants";

export const useSmartLocation = () => {
  const [location, setLocation] = useState(null);
  const [status, setStatus] = useState("Waiting for permission...");
  const [hasMoved, setHasMoved] = useState(false);

  const previousLocation = useRef(null);
  const intervalRef = useRef(null);

  const getLocation = () => {
    if (!navigator.geolocation) {
      setStatus("Geolocation not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newLocation = { latitude, longitude };

        if (!previousLocation.current) {
          previousLocation.current = newLocation;
          setLocation(newLocation);
          setStatus("Initial location detected.");
          setHasMoved(false);
          return;
        }

        const distance = calculateDistance(
          previousLocation.current.latitude,
          previousLocation.current.longitude,
          latitude,
          longitude
        );

        if (distance > DISTANCE_THRESHOLD) {
          previousLocation.current = newLocation;
          setLocation(newLocation);
          setStatus(`Moved ${distance.toFixed(2)} meters`);
          setHasMoved(true);
        } else {
          setStatus("Inside 50m radius. No update needed.");
          setHasMoved(false);
        }
      },
      () => {
        setStatus("Permission denied.");
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  useEffect(() => {
    getLocation();
    intervalRef.current = setInterval(getLocation, INTERVAL_TIME);

    return () => clearInterval(intervalRef.current);
  }, []);

  return { location, status, hasMoved };
};