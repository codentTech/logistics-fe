"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import PropTypes from "prop-types";
import useRole from "@/common/hooks/use-role.hook";
import ROLES from "@/common/constants/role.constant";
import Loader from "@/common/components/loader/loader.component";

/**
 * Role Guard Component
 * Protects routes/components based on user role
 * 
 * @param {ReactNode} children - Component to render if role check passes
 * @param {string|string[]} allowedRoles - Single role or array of allowed roles
 * @param {ReactNode} fallback - Component to render if role check fails (optional)
 * @param {boolean} redirect - Whether to redirect to dashboard if access denied (default: true)
 */
export default function RoleGuard({
  children,
  allowedRoles,
  fallback = null,
  redirect = true,
}) {
  const { role, hasRole, hasAnyRole } = useRole();
  const router = useRouter();

  // Normalize allowedRoles to array
  const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  // Check if user has required role
  const hasAccess = rolesArray.some((r) => hasRole(r));

  useEffect(() => {
    if (!hasAccess && redirect) {
      // Redirect to dashboard if access denied
      router.push("/dashboard");
    }
  }, [hasAccess, redirect, router]);

  if (!hasAccess) {
    if (fallback) {
      return fallback;
    }
    if (redirect) {
      return (
        <div className="flex min-h-[400px] items-center justify-center">
          <Loader loading={true} size={60} />
        </div>
      );
    }
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return children;
}

RoleGuard.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
  fallback: PropTypes.node,
  redirect: PropTypes.bool,
};

