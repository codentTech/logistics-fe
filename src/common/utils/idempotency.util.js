"use client";

import { v4 as uuidv4 } from 'uuid';

/**
 * Generate a unique Idempotency-Key for API requests
 * @returns {string} UUID v4 string
 */
export const generateIdempotencyKey = () => {
  return uuidv4();
};

/**
 * Get Idempotency-Key headers object
 * @returns {Object} Headers object with Idempotency-Key
 */
export const getIdempotencyHeaders = () => {
  return {
    'Idempotency-Key': generateIdempotencyKey(),
  };
};

