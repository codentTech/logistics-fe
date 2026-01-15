"use client";

import { use } from "react";
import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import ShipmentDetails from "@/components/shipments/shipment-details.component";
import NAVBAR_TITLE from "@/common/constants/navbar-title.constant";
import RoleGuard from "@/common/components/role-guard/role-guard.component";
import ROLES from "@/common/constants/role.constant";

export default function ShipmentDetailsPage({ params }) {
  const { id } = use(params);
  const shipmentId = id;

  return (
    <Auth
      component={
        <RoleGuard
          allowedRoles={[ROLES.OPS_ADMIN, ROLES.DRIVER, ROLES.CUSTOMER]}
        >
          <ShipmentDetails shipmentId={shipmentId} />
        </RoleGuard>
      }
      type={AUTH.PRIVATE}
      title={NAVBAR_TITLE.SHIPMENT_DETAILS || "Shipment Details"}
    />
  );
}
