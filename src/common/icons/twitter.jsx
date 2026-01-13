import Image from "next/image";

const TwitterIcon = ({ width = 32, height = 32 }) => (
  <div>
    <Image src="/assets/icons/social-media/twitter.png" alt="logo" width={width} height={height} />
  </div>
);
export default TwitterIcon;
