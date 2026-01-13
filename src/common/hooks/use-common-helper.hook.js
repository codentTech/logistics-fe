import { AlertCircle, CheckCircle2, Clock } from "lucide-react";

function useCommonHelpers() {
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-50";
      case "in-progress":
        return "text-blue-600 bg-blue-50";
      case "pending":
        return "text-gray-600 bg-gray-50";
      case "revision":
        return "text-orange-600 bg-orange-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-4 h-4" />;
      case "in-progress":
        return <Clock className="w-4 h-4" />;
      case "revision":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };
  return { getStatusColor, getStatusIcon };
}

export default useCommonHelpers;
