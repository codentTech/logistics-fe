import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout, setLogoutLoader } from "@/provider/features/auth/auth.slice";
import { disconnectSocket } from "@/common/hooks/use-socket.hook";

export default function useNavbar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const user = useSelector((state) => {
    // Get user from auth state (OpsCore format)
    const authUser = state.auth?.login?.data;
    if (authUser) {
      const userData = authUser.user || authUser;
      const firstName = userData.firstName || "";
      const lastName = userData.lastName || "";
      const fullName = [firstName, lastName].filter(Boolean).join(" ") || null;
      
      return {
        email: userData.email || authUser.email,
        role: userData.role || authUser.role,
        firstName: firstName || null,
        lastName: lastName || null,
        name: fullName,
      };
    }
    
    // Fallback: try to get from localStorage
    if (typeof window !== "undefined") {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        const firstName = storedUser.firstName || "";
        const lastName = storedUser.lastName || "";
        const fullName = [firstName, lastName].filter(Boolean).join(" ") || null;
        
        return { 
          email: storedUser.email, 
          role: storedUser.role,
          firstName: firstName || null,
          lastName: lastName || null,
          name: fullName,
        };
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
    
    // Disconnect Socket.IO connection before logout to ensure driver is marked offline
    disconnectSocket();
    
    // Small delay to ensure backend processes disconnect
    await new Promise(resolve => setTimeout(resolve, 100));
    
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
