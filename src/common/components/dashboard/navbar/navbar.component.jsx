"use client";

import { ChevronDown, ChevronRight, LogOut, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import PropTypes from "prop-types";
import { useEffect, useMemo, useRef } from "react";
import useNavbar from "./use-navbar.hook";
import NotificationBadge from "@/common/components/notifications/notification-badge.component";

export default function Navbar({ title }) {
  const { user, open, handleClick, profileMenu, handleLogout } = useNavbar();
  const pathname = usePathname();

  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        open &&
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        profileMenu();
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, profileMenu]);

  // Generate breadcrumbs from pathname
  const breadcrumbs = useMemo(() => {
    const paths = pathname.split("/").filter(Boolean);
    const items = [{ label: "Dashboard", path: "/dashboard" }];

    if (
      paths.length === 0 ||
      (paths.length === 1 && paths[0] === "dashboard")
    ) {
      return items;
    }

    let currentPath = "";
    paths.forEach((segment, index) => {
      if (segment === "dashboard") return;

      currentPath += `/${segment}`;
      const label = segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      items.push({
        label,
        path: currentPath,
        isLast: index === paths.length - 1,
      });
    });

    return items;
  }, [pathname]);

  return (
    <div className="border-b border-gray-200 bg-white px-6 py-4">
      <div className="flex items-center justify-between">
        <nav className="flex items-center space-x-2" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            {breadcrumbs.map((item, index) => (
              <li key={item.path} className="flex items-center">
                {index > 0 && (
                  <ChevronRight className="mx-2 h-4 w-4 text-gray-400" />
                )}
                {item.isLast ? (
                  <span className="text-sm font-medium text-gray-900">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.path}
                    className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <div className="flex items-center gap-4">
          <NotificationBadge />
          
          <div className="relative z-50">
            <button
            ref={buttonRef}
            onClick={handleClick}
            className="flex items-center gap-2 rounded-lg border-0 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-0 active:border-0"
            aria-expanded={open}
            aria-haspopup="true"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
              <User className="h-4 w-4" />
            </div>
            <span className="hidden sm:block">
              {user?.name || user?.email || "User"}
            </span>
            <ChevronDown
              className={`h-4 w-4 text-gray-400 transition-transform ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {open && (
            <div
              ref={menuRef}
              className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-lg border border-gray-200 bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            >
              <div className="py-1">
                <div className="border-b border-gray-100 px-4 py-3 space-y-1">
                  {user?.name && (
                    <p className="text-sm font-medium text-gray-900">
                      {user.name}
                    </p>
                  )}
                  {user?.email && (
                    <p className="text-xs text-gray-500">
                      {user.email}
                    </p>
                  )}
                  {user?.role && (
                    <p className="text-xs text-gray-500 capitalize">
                      {user.role.replace("_", " ")}
                    </p>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <LogOut className="h-4 w-4 text-gray-400" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}
Navbar.propTypes = {
  title: PropTypes.string,
};
