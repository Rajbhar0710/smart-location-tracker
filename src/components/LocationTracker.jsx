import { useSmartLocation } from "../hooks/useSmartLocation";

const LocationTracker = () => {
  const { location, status, hasMoved } = useSmartLocation();

  return (
    <div className="space-y-6">

      {/* Status Box */}
      <div
        className={`p-4 rounded-xl text-center font-medium transition-all duration-500 ${
          hasMoved
            ? "bg-red-500/20 border border-red-400 text-red-300"
            : "bg-green-500/20 border border-green-400 text-green-300"
        }`}
      >
        {status}
      </div>

      {/* Location Card */}
      {location && (
        <div className="bg-white/10 rounded-xl p-4 text-sm space-y-3">
          
          <div className="flex justify-between">
            <span className="opacity-70">Latitude</span>
            <span className="font-medium">
              {location.latitude.toFixed(6)}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="opacity-70">Longitude</span>
            <span className="font-medium">
              {location.longitude.toFixed(6)}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="opacity-70">Last Update</span>
            <span className="font-medium">
              {new Date().toLocaleTimeString()}
            </span>
          </div>

        </div>
      )}

    </div>
  );
};

export default LocationTracker;