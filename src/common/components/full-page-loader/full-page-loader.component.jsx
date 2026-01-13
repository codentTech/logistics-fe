import { Package } from "lucide-react";

function FullPageLoader() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-500 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
          <Package className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Full Page Loader</h1>
        <div className="w-36 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="w-full h-full bg-gradient-to-r from-primary-400 to-primary-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

export default FullPageLoader;
