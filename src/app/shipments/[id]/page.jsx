"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import ShipmentDetails from "@/components/shipments/shipment-details.component";
import NAVBAR_TITLE from "@/common/constants/navbar-title.constant";

export default function ShipmentDetailsPage({ params }) {
  // In Next.js 15 App Router, params is a Promise
  const shipmentId = typeof params.id === 'string' ? params.id : params.id?.toString();
  
  return (
    <Auth
      component={<ShipmentDetails shipmentId={shipmentId} />}
      type={AUTH.PRIVATE}
      title={NAVBAR_TITLE.SHIPMENT_DETAILS || "Shipment Details"}
    />
  );
}

