"use client";

import { isJwtExpired } from "jwt-check-expiration";
import { getUser } from "./users.util";

/**
 * Retrieve access token from local storage - OpsCore format
 * @returns string | undefined
 */
export const getAccessToken = (data) => {
  if (
    (typeof window === "object" && window?.localStorage?.getItem("user")) ||
    data
  ) {
    const user = data ?? getUser();
    return user?.token;
  }
  return undefined;
};

/**
 * Retrieve isLoginVerified Status - OpsCore format
 * @returns bool
 */
export const isLoginVerified = (data) => {
  if (
    (typeof window === "object" && window?.localStorage?.getItem("user")) ||
    data
  ) {
    const user = data ?? getUser();
    return !!user?.token && !isJwtExpired(user.token);
  }
  return false;
};

/**
 * Retrieve access token from local storage and check if it has expired - OpsCore format
 * @returns boolean | null
 */
export const checkExpiryDateOfToken = () => {
  if (typeof window === "object" && window?.localStorage?.getItem("user")) {
    const user = getUser();
    if (user?.token) {
      return !isJwtExpired(user.token);
    }
    return null;
  }
  return null;
};
