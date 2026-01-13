"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import CreateShipment from "@/components/shipments/create-shipment.component";
import NAVBAR_TITLE from "@/common/constants/navbar-title.constant";

export default function CreateShipmentPage() {
  return (
    <Auth
      component={<CreateShipment />}
      type={AUTH.PRIVATE}
      title={NAVBAR_TITLE.CREATE_SHIPMENT || "Create Shipment"}
    />
  );
}

