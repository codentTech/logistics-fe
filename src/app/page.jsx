"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { checkExpiryDateOfToken } from "@/common/utils/access-token.util";

/**
 * @returns redirects to dashboard if logged in, otherwise to login
 */
export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = checkExpiryDateOfToken();
    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, [router]);

  return null;
}
