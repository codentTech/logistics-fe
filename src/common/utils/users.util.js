"use client";

/**
 * Retrieve user from local storage
 * @returns object | undefined
 */
export const getUser = () => {
  if (typeof window === "object" && window?.localStorage?.getItem("user")) {
    return JSON.parse(localStorage.getItem("user"));
  }
  return undefined;
};

/**
 * Remove the user from local storage
 */
export const removeUser = () => {
  if (typeof window === "object" && window.localStorage) {
    localStorage.removeItem("user");
  }
};
