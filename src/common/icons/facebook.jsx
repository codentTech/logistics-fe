import Image from "next/image";

const FacebookIcon = ({ width = 32, height = 32 }) => (
  <div>
    <Image src="/assets/icons/social-media/facebook.png" alt="logo" width={width} height={height} />
  </div>
);
export default FacebookIcon;
