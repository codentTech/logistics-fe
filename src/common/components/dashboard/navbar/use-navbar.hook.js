import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout, setLogoutLoader } from "@/provider/features/auth/auth.slice";

export default function useNavbar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const user = useSelector((state) => {
    // Get user from auth state (OpsCore format)
    const authUser = state.auth?.login?.data;
    if (authUser) {
      return {
        email: authUser.user?.email || authUser.email,
        role: authUser.user?.role || authUser.role,
      };
    }
    // Fallback: try to get from localStorage
    if (typeof window !== "undefined") {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        return { email: storedUser.email, role: storedUser.role };
      } catch {
        return null;
      }
    }
    return null;
  });

  const handleClick = () => {
    setOpen(!open);
  };

  const profileMenu = () => {
    setOpen(false);
  };

  const handleLogout = async () => {
    setOpen(false);
    await dispatch(logout());
    router.push("/login");
  };

  return {
    user,
    open,
    handleClick,
    profileMenu,
    handleLogout,
  };
}
