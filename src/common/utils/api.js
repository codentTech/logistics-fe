"use client";

import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { getAccessToken } from "./access-token.util";
import { removeUser } from "./users.util";

const api = (headers = {}) => {
  const accessToken = getAccessToken();

  const defaultHeaders = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  const combinedHeaders = accessToken
    ? { ...defaultHeaders, ...headers, Authorization: `Bearer ${accessToken}` }
    : { ...defaultHeaders, ...headers };

  const apiInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_MAIN_URL || "http://localhost:5000",
    headers: combinedHeaders,
  });

  apiInstance.interceptors.response.use(
    async (response) => {
      const method = response.config.method;
      const endpoint = response.config.url?.split("/").pop();
      const url = response.config.url || "";
      const isLocationEndpoint =
        url.includes("/location") && url.includes("/drivers/");

      // Don't show success toast for location updates (they happen frequently)
      const isSuccessResponse =
        (method === "get" && endpoint === "location") ||
        (["post", "put", "delete"].includes(method) &&
          !["get", "get-all"].includes(endpoint) &&
          !isLocationEndpoint);

      if (isSuccessResponse) {
        enqueueSnackbar(response.data?.message || "Success", {
          variant: "success",
        });
      }

      return response;
    },
    (error) => {
      // Network issues
      if (error.message === "Network Error") {
        enqueueSnackbar(error.message, { variant: "error" });
        throw error;
      }

      const status = error.response?.status;
      const message =
        error.response?.data?.message || error.message || error.toString();

      if (status === 401 && typeof window !== "undefined") {
        const currentPath = window.location.pathname;
        if (currentPath !== "/login" && !currentPath.startsWith("/login")) {
          removeUser();
          window.location.href = "/login";
          return;
        }
      }

      if (Array.isArray(message)) {
        message.forEach((msg) => enqueueSnackbar(msg, { variant: "error" }));
      } else {
        const responseURL = error.request?.responseURL;
        const currentEndpoint = responseURL?.split("/").pop();

        if (currentEndpoint === "current-business-setting") {
          return error.message;
        }

        if (message && message !== "Record Not Found") {
          enqueueSnackbar(message, { variant: "error" });
        }
      }

      return Promise.reject(error);
    }
  );

  return apiInstance;
};

export default api;
