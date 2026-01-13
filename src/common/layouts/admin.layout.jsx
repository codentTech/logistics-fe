"use client";

import Header from "@/components/admin/header/header.component";
import Sidebar from "@/components/admin/sidebar/sidebar.component";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [activeRoute, setActiveRoute] = useState(pathname || "/admin/dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState("30");
  const [unreadNotifications] = useState(5);

  // User data
  const user = {
    name: "John Admin",
    email: "admin@itweststore.com",
    role: "Super Admin",
    avatar: "/api/placeholder/40/40",
  };

  // Date range options for global filter
  const dateRangeOptions = [
    { label: "Last 7 Days", value: "7" },
    { label: "Last 30 Days", value: "30" },
    { label: "Last 3 Months", value: "90" },
    { label: "Last 6 Months", value: "180" },
    { label: "Last Year", value: "365" },
  ];

  // Update active route when pathname changes
  useEffect(() => {
    if (pathname) {
      setActiveRoute(pathname);
    }
  }, [pathname]);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(true);
        setMobileMenuOpen(false);
      } else {
        // Auto-expand sidebar on larger screens
        setSidebarCollapsed(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    // Close any open dropdowns when route changes
    setUserMenuOpen(false);
    setNotificationsOpen(false);
  }, [activeRoute]);

  // Get page title from pathname
  const getPageTitle = () => {
    if (!activeRoute) return "Dashboard";

    const pathSegments = activeRoute.split("/").filter(Boolean);
    if (pathSegments.length <= 1) return "Dashboard";

    const lastSegment = pathSegments[pathSegments.length - 1];
    return lastSegment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Get breadcrumbs from pathname
  const getBreadcrumbs = () => {
    if (!activeRoute) return [{ label: "Dashboard", path: "/admin" }];

    const pathSegments = activeRoute.split("/").filter(Boolean);
    const breadcrumbs = [{ label: "Home", path: "/admin" }];

    let currentPath = "";
    pathSegments.forEach((segment, index) => {
      if (segment === "admin") return;

      currentPath += `/${segment}`;
      const label = segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      breadcrumbs.push({
        label,
        path: `/admin${currentPath}`,
        isLast: index === pathSegments.length - 1,
      });
    });

    return breadcrumbs;
  };

  // Notification data
  const notifications = [
    {
      id: 1,
      title: "New Order Received",
      message: "Order #ORD-2024-001 from TechCorp Inc.",
      time: "2 minutes ago",
      type: "order",
      unread: true,
    },
    {
      id: 2,
      title: "Low Stock Alert",
      message: "Samsung 980 PRO 2TB SSD is running low",
      time: "1 hour ago",
      type: "inventory",
      unread: true,
    },
    {
      id: 3,
      title: "Payment Received",
      message: "$2,149.99 payment processed successfully",
      time: "3 hours ago",
      type: "payment",
      unread: false,
    },
  ];

  // Handle navigation
  const handleNavigation = (path) => {
    console.log("Navigate to:", path);
    setActiveRoute(path);
    // In real implementation with Next.js router:
    // router.push(path);
  };

  // Handle mobile menu toggle
  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Handle sidebar toggle
  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Handle outside clicks to close dropdowns
  const handleOutsideClick = () => {
    setUserMenuOpen(false);
    setNotificationsOpen(false);
    if (mobileMenuOpen && window.innerWidth < 1024) {
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Always Fixed */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={handleSidebarToggle}
        activeRoute={activeRoute}
      />

      {/* Main Content Area - With Left Margin for Sidebar */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        {/* Header */}
        <Header
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          getBreadcrumbs={getBreadcrumbs}
          handleNavigation={handleNavigation}
          getPageTitle={getPageTitle}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          dateRangeOptions={dateRangeOptions}
          selectedDateRange={selectedDateRange}
          setSelectedDateRange={setSelectedDateRange}
          unreadNotifications={unreadNotifications}
          notifications={notifications}
          notificationsOpen={notificationsOpen}
          setNotificationsOpen={setNotificationsOpen}
          userMenuOpen={userMenuOpen}
          setUserMenuOpen={setUserMenuOpen}
          user={user}
          activeRoute={activeRoute}
        />

        {/* Page Title Section */}
        <div className="hidden md:block px-4 lg:px-6 py-4 bg-white border-b border-primary-50">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">{getPageTitle()}</h1>
              <p className="text-neutral-600 mt-1">
                {activeRoute === "/admin" || activeRoute === "/admin/dashboard"
                  ? "Welcome back! Here's what's happening with your store."
                  : `Manage your ${getPageTitle().toLowerCase()} efficiently`}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-x-hidden">{children}</main>

        {/* Footer */}
        <footer className="bg-white border-t border-primary-100 px-4 lg:px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4 text-sm text-neutral-600">
              <span>© 2024 ITWestStore. All rights reserved.</span>
              <span className="hidden md:inline">•</span>
              <button className="hidden md:inline hover:text-primary-600 transition-colors">
                Privacy Policy
              </button>
              <span className="hidden md:inline">•</span>
              <button className="hidden md:inline hover:text-primary-600 transition-colors">
                Terms of Service
              </button>
            </div>

            <div className="flex items-center space-x-4 mt-2 md:mt-0 text-sm text-neutral-600">
              <span>Version 2.1.0</span>
              <span className="hidden md:inline">•</span>
              <button className="hidden md:inline hover:text-primary-600 transition-colors">
                Documentation
              </button>
              <span className="hidden md:inline">•</span>
              <button className="hidden md:inline hover:text-primary-600 transition-colors">
                Support
              </button>
            </div>
          </div>
        </footer>
      </div>

      {/* Click outside handler for dropdowns */}
      {(userMenuOpen || notificationsOpen) && (
        <div className="fixed inset-0 z-30" onClick={handleOutsideClick} />
      )}
    </div>
  );
}
