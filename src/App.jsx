import LocationTracker from "./components/LocationTracker";

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-900 via-blue-800 to-indigo-700 p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 text-white">
        
        <h1 className="text-2xl font-bold text-center mb-6 tracking-wide">
          📍 Smart Location Tracker
        </h1>

        <LocationTracker />

      </div>
    </div>
  );
}

export default App;