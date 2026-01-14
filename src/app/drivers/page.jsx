"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import DriversList from "@/components/drivers/drivers-list.component";
import NAVBAR_TITLE from "@/common/constants/navbar-title.constant";
import RoleGuard from "@/common/components/role-guard/role-guard.component";
import ROLES from "@/common/constants/role.constant";

export default function DriversPage() {
  return (
    <Auth
      component={
        <RoleGuard allowedRoles={[ROLES.OPS_ADMIN]}>
          <DriversList />
        </RoleGuard>
      }
      type={AUTH.PRIVATE}
      title={NAVBAR_TITLE.DRIVERS || "Drivers"}
    />
  );
}

