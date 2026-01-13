function FullPageLoader() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden">
      {/* Ripple effect - like pebble in water */}
      <div className="relative w-20 h-20">
        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="w-6 h-6 animate-pulse bg-indigo-600 rounded-full"></div>
        </div>

        {/* Expanding rings */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute w-20 h-20 border-2 border-indigo-300 rounded-full animate-ripple-1"></div>
          <div className="absolute w-20 h-20 border-2 border-indigo-400 rounded-full animate-ripple-2"></div>
          <div className="absolute w-20 h-20 border-2 border-indigo-500 rounded-full animate-ripple-3"></div>
        </div>
      </div>
    </div>
  );
}

export default FullPageLoader;
