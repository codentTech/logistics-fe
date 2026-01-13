"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import DriverLocationShare from "@/components/drivers/driver-location-share.component";

export default function DriverLocationPage() {
  return (
    <Auth
      component={<DriverLocationShare />}
      type={AUTH.PRIVATE}
      title="Share Location"
    />
  );
}

