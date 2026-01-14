"use client";

import { useMemo } from "react";
import { getUser } from "@/common/utils/users.util";
import ROLES from "@/common/constants/role.constant";

/**
 * Hook to get current user role and check role-based permissions
 * @returns {object} - { role, isAdmin, isDriver, isCustomer, hasRole }
 */
export default function useRole() {
  const currentUser = getUser();
  const role = currentUser?.role;

  const isAdmin = useMemo(() => role === ROLES.OPS_ADMIN, [role]);
  const isDriver = useMemo(() => role === ROLES.DRIVER, [role]);
  const isCustomer = useMemo(() => role === ROLES.CUSTOMER, [role]);

  /**
   * Check if user has specific role
   * @param {string} requiredRole - Role to check
   * @returns {boolean}
   */
  const hasRole = (requiredRole) => {
    return role === requiredRole;
  };

  /**
   * Check if user has any of the provided roles
   * @param {string[]} roles - Array of roles to check
   * @returns {boolean}
   */
  const hasAnyRole = (roles) => {
    return roles.includes(role);
  };

  return {
    role,
    isAdmin,
    isDriver,
    isCustomer,
    hasRole,
    hasAnyRole,
  };
}

