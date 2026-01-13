import Image from "next/image";

const TikTokIcon = ({ width = 32, height = 32 }) => (
  <div>
    <Image src="/assets/icons/social-media/tiktok.png" alt="logo" width={width} height={height} />
  </div>
);
export default TikTokIcon;
