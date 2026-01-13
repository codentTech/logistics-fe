import { Users } from "lucide-react";
import InstagramIcon from "../icons/instagram";
import TikTokIcon from "../icons/tiktok";
import TwitterIcon from "../icons/twitter";
import YoutubeIcon from "../icons/youtube";

function useGetplatform() {
  const getPlatformIcon = (platform) => {
    const value = platform?.toLowerCase();
    switch (value) {
      case "instagram":
        return <InstagramIcon className="w-4 h-4" />;
      case "youtube":
        return <YoutubeIcon className="w-4 h-4" />;
      case "twitter":
        return <TwitterIcon className="w-4 h-4" />;
      case "tiktok":
        return <TikTokIcon className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  const getPlatformColor = (platform) => {
    const value = platform?.toLowerCase();
    switch (value) {
      case "instagram":
        return "bg-pink-100 text-pink-800";
      case "youtube":
        return "bg-red-100 text-red-800";
      case "twitter":
        return "bg-blue-100 text-green-800";
      case "tiktok":
        return "bg-gray-100 text-green-800";
      default:
        return "bg-gray-100 text-green-800";
    }
  };

  return { getPlatformIcon, getPlatformColor };
}

export default useGetplatform;
