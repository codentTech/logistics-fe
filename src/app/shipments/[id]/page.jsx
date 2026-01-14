"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import ShipmentDetails from "@/components/shipments/shipment-details.component";
import NAVBAR_TITLE from "@/common/constants/navbar-title.constant";
import RoleGuard from "@/common/components/role-guard/role-guard.component";
import ROLES from "@/common/constants/role.constant";

export default function ShipmentDetailsPage({ params }) {
  // In Next.js 15 App Router, params is a Promise
  const shipmentId = typeof params.id === 'string' ? params.id : params.id?.toString();
  
  return (
    <Auth
      component={
        <RoleGuard allowedRoles={[ROLES.OPS_ADMIN, ROLES.DRIVER, ROLES.CUSTOMER]}>
          <ShipmentDetails shipmentId={shipmentId} />
        </RoleGuard>
      }
      type={AUTH.PRIVATE}
      title={NAVBAR_TITLE.SHIPMENT_DETAILS || "Shipment Details"}
    />
  );
}

