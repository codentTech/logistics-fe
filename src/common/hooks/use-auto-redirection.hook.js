"use client";

import { useRouter } from "next/navigation";
import {
  getEmailForURL,
  getUser,
  is2FAEnabled,
  isEmailVerified,
  isPhoneVerified,
  isProfileCreated,
  isSuperAdmin,
} from "../utils/users.util";
import { isLoginVerified } from "../utils/access-token.util";

export default function useAutoRedirection() {
  const router = useRouter();
  const user = getUser();
  const email = getEmailForURL(user?.email);
  // if (user) {
  //   if (!isSuperAdmin(user)) {
  //     if (!isProfileCreated(user)) {
  //       if (typeof window === 'object') {
  //         router.push(`/profile?email=${email}&userId=${user.id}`);
  //       }
  //     }

  //     if (!isEmailVerified(user)) {
  //       if (typeof window === 'object') {
  //         router.push(`/verify-email?type=email-verification&email=${email}`);
  //       }
  //     }

  //     if (
  //       is2FAEnabled(user) &&
  //       !isLoginVerified(user) &&
  //       isPhoneVerified(user) &&
  //       isEmailVerified(user)
  //     ) {
  //       if (typeof window === 'object') {
  //         router.push(`/two-factor-auth?userId=${user.id}&phone=${user.phone}`);
  //       }
  //     }

  //     //   router.push('/dashboard');
  //   } else {
  //     router.push('/super-admin/dashboard');
  //   }
  // }

  return { user };
}
