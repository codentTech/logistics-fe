"use client";

import { useRouter } from "next/navigation";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import Navbar from "@/common/components/dashboard/navbar/navbar.component";
import NAVBAR_TITLE from "@/common/constants/navbar-title.constant";
import { isLoginVerified } from "@/common/utils/access-token.util";
import { removeUser } from "@/common/utils/users.util";
import Loadar from "@/common/components/loadar/loadar.component";
import Link from "next/link";
import { usePathname } from "next/navigation";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";

/**
 * Return the component if access token is verified and return to home page if its not
 * @param {component} props take a component
 * @returns component | redirect to home page
 */
export default function Private({ component, title = NAVBAR_TITLE.DASHBOARD }) {
  const { logoutLoader } = useSelector((state) => state?.auth);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoginVerified()) {
      removeUser();
      router.push("/login");
    }
  }, [router]);

  if (logoutLoader) {
    return <Loadar />;
  }

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: DashboardIcon },
    { path: "/shipments", label: "Shipments", icon: LocalShippingIcon },
    { path: "/drivers", label: "Drivers", icon: DirectionsCarIcon },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 border-r border-gray-200 bg-white">
        <div className="p-6">
          <h2 className="text-xl font-bold text-indigo-600">OpsCore</h2>
        </div>
        <nav className="px-4">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            const IconComponent = item.icon;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`mb-1 flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <IconComponent className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Navbar title={title} />
        <main className="flex-1 overflow-y-auto">{component}</main>
      </div>
    </div>
  );
}

Private.propTypes = {
  component: PropTypes.element.isRequired,
  title: PropTypes.string,
};
