'use client';

import { useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { isLoginVerified } from '@/common/utils/access-token.util';

/**
 * Return a component or return to home page if access token is verified
 * @param {component} props
 * @returns component | redirect to home page
 */
export default function AuthMainRoutes({ component }) {
  const router = useRouter();

  useEffect(() => {
    if (isLoginVerified() && typeof window === 'object') {
      router.push('/dashboard');
    }
  }, []);
  return component;
}

AuthMainRoutes.propTypes = {
  component: PropTypes.element.isRequired
};
