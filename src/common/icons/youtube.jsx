import Image from "next/image";
import React from "react";

const YoutubeIcon = ({ width = 32, height = 32 }) => (
  <div>
    <Image src="/assets/icons/social-media/youtube.png" alt="logo" width={width} height={height} />
  </div>
);

export default YoutubeIcon;
