"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import Dashboard from "@/components/dashboard/dashboard.component";
import NAVBAR_TITLE from "@/common/constants/navbar-title.constant";

export default function DashboardPage() {
  return (
    <Auth
      component={<Dashboard />}
      type={AUTH.PRIVATE}
      title={NAVBAR_TITLE.DASHBOARD || "Dashboard"}
    />
  );
}

