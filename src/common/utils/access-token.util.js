'use client';

import { isJwtExpired } from 'jwt-check-expiration';
import authService from '@/provider/features/auth/auth.service';
import { getUser } from './users.util';

/**
 * Retrive access token from local storage - OpsCore format
 * @returns string | undefined
 */
export const getAccessToken = (data) => {
  if ((typeof window === 'object' && window?.localStorage?.getItem('user')) || data) {
    const user = data ?? getUser();
    return user?.token;
  }
  return undefined;
};

/**
 * Retrive isLoginVerified Status - OpsCore format
 * @returns bool
 */
export const isLoginVerified = (data) => {
  if ((typeof window === 'object' && window?.localStorage?.getItem('user')) || data) {
    const user = data ?? getUser();
    return !!user?.token && !isJwtExpired(user.token);
  }
  return false;
};

/**
 * Retrive access token expiry date from local storage
 * @returns date | undefined
 */
export const getAccessTokenExpiry = () => {
  if (typeof window === 'object') {
    const accessTokenExpiry = JSON.parse(
      window.localStorage.getItem('accessTokenExpiry')
    );
    return accessTokenExpiry;
  }
  return null;
};

/**
 * Delete token for old users
 * @returns false | true
 */
export const checkForOldToken = async () => {
  if (typeof window === 'object' && window?.localStorage?.getItem('user')) {
    if (getUser()?.loginVerifiedToken?.[0].token) {
      const response = await authService.logout();
      return response.Succeeded;
    }
    return false;
  }
  return false;
};

/**
 * Retrieve access token from local storage and check if it has expired - OpsCore format
 * @returns string | null
 */
export const checkExpiryDateOfToken = () => {
  if (typeof window === 'object' && window?.localStorage?.getItem('user')) {
    const user = getUser();
    if (user?.token) {
      if (isJwtExpired(user.token) === false) {
        return true;
      }
      return false;
    }
    return null;
  }
  return null;
};
