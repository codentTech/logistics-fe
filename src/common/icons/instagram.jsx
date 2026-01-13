import Image from "next/image";

const InstagramIcon = ({ width = 32, height = 32 }) => (
  <div>
    <Image
      src="/assets/icons/social-media/instagram.png"
      alt="logo"
      width={width}
      height={height}
    />
  </div>
);
export default InstagramIcon;
