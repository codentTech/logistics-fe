"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import ShipmentsList from "@/components/shipments/shipments-list.component";
import NAVBAR_TITLE from "@/common/constants/navbar-title.constant";

export default function ShipmentsPage() {
  return (
    <Auth
      component={<ShipmentsList />}
      type={AUTH.PRIVATE}
      title={NAVBAR_TITLE.SHIPMENTS || "Shipments"}
    />
  );
}

