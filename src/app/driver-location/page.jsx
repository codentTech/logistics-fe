"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import DriverLocationShare from "@/components/drivers/driver-location-share.component";
import RoleGuard from "@/common/components/role-guard/role-guard.component";
import ROLES from "@/common/constants/role.constant";

export default function DriverLocationPage() {
  return (
    <Auth
      component={
        <RoleGuard allowedRoles={[ROLES.DRIVER]}>
          <DriverLocationShare />
        </RoleGuard>
      }
      type={AUTH.PRIVATE}
      title="Share Location"
    />
  );
}

