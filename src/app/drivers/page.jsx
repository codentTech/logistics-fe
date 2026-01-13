"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import DriversList from "@/components/drivers/drivers-list.component";
import NAVBAR_TITLE from "@/common/constants/navbar-title.constant";

export default function DriversPage() {
  return (
    <Auth
      component={<DriversList />}
      type={AUTH.PRIVATE}
      title={NAVBAR_TITLE.DRIVERS || "Drivers"}
    />
  );
}

