"use client";

import { useRouter } from "next/navigation";
import PropTypes from "prop-types";
import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import Navbar from "@/common/components/dashboard/navbar/navbar.component";
import NAVBAR_TITLE from "@/common/constants/navbar-title.constant";
import { isLoginVerified } from "@/common/utils/access-token.util";
import { removeUser, getUser } from "@/common/utils/users.util";
import Loadar from "@/common/components/loadar/loadar.component";
import Link from "next/link";
import { usePathname } from "next/navigation";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import ROLES from "@/common/constants/role.constant";

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

  // Get current user role for role-based navigation
  const currentUser = getUser();
  const userRole = currentUser?.role;

  // Define all possible nav items
  const allNavItems = [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: DashboardIcon,
      roles: [ROLES.OPS_ADMIN, ROLES.DRIVER, ROLES.CUSTOMER], // All roles can access
    },
    {
      path: "/shipments",
      label: "Shipments",
      icon: LocalShippingIcon,
      roles: [ROLES.OPS_ADMIN, ROLES.DRIVER, ROLES.CUSTOMER], // All roles can access
    },
    {
      path: "/drivers",
      label: "Drivers",
      icon: DirectionsCarIcon,
      roles: [ROLES.OPS_ADMIN], // Admin only
    },
  ];

  // Filter nav items based on user role
  const navItems = useMemo(() => {
    if (!userRole) return [];
    return allNavItems.filter((item) => item.roles.includes(userRole));
  }, [userRole]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Fixed/Sticky */}
      <div className="fixed left-0 top-0 h-screen w-64 border-r border-gray-200 bg-white z-40 overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold text-indigo-600 mb-1">OpsCore</h2>
        </div>
        <nav className="px-4 border-t border-gray-200 pb-6">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            const IconComponent = item.icon;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`mb-1 mt-4 flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
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
      <div className="flex-1 flex flex-col ml-64">
        {/* Navbar - Sticky */}
        <div className="sticky top-0 z-30">
          <Navbar title={title} />
        </div>
        <main className="flex-1 overflow-y-auto">{component}</main>
      </div>
    </div>
  );
}

Private.propTypes = {
  component: PropTypes.element.isRequired,
  title: PropTypes.string,
};
