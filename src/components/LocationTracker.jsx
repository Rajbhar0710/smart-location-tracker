import React, { useEffect, useState, useRef } from "react";

const LocationTracker = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const lastLocationRef = useRef(null);
  const lastUpdateTimeRef = useRef(Date.now());

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported by your browser");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const currentTime = new Date().toLocaleTimeString();

        const newLocation = { latitude, longitude, accuracy, time: currentTime };

        const now = Date.now();
        const lastLocation = lastLocationRef.current;

        // If last location exists, check distance
        if (lastLocation) {
          const distance = getDistance(
            lastLocation.latitude,
            lastLocation.longitude,
            latitude,
            longitude
          );

          // Update only if moved 50+ meters AND 30+ seconds since last update
          if (distance < 50 && now - lastUpdateTimeRef.current < 30000) return;
        }

        lastLocationRef.current = newLocation;
        lastUpdateTimeRef.current = now;
        setLocation(newLocation);
      },
      (err) => setError(err.message),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const toRad = (x) => (x * Math.PI) / 180;
    const φ1 = toRad(lat1);
    const φ2 = toRad(lat2);
    const Δφ = toRad(lat2 - lat1);
    const Δλ = toRad(lon2 - lon1);
    const a =
      Math.sin(Δφ / 2) ** 2 +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  return (
    <div className="space-y-5">
      {error && (
        <p className="text-red-400 font-semibold text-center animate-pulse">
          ⚠ {error}
        </p>
      )}

      {location ? (
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-6 flex flex-col space-y-3 transition-transform transform hover:scale-105 duration-300">
          <h2 className="text-xl font-bold text-white text-center mb-2 tracking-wide">
            🌍 Current Location
          </h2>

          <div className="grid grid-cols-1 gap-2 text-white text-sm">
            <div className="flex justify-between">
              <span className="font-medium">Latitude:</span>
              <span>{location.latitude}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Longitude:</span>
              <span>{location.longitude}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Accuracy:</span>
              <span>{location.accuracy} m</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Last Updated:</span>
              <span>{location.time}</span>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-white text-center animate-pulse">
          ⏳ Detecting location...
        </p>
      )}
    </div>
  );
};

export default LocationTracker;