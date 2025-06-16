import React from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation"; // For Next.js 13+ app directory

const ProtectedRoute = ({ role: requiredRole, children }) => {
  const router = useRouter();
  let token, userRole;

  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        userRole = decoded.role;
        console.log("userRole", userRole);
      } catch (e) {
        userRole = null;
      }
    }
  }

  React.useEffect(() => {
    if (!token || userRole !== requiredRole) {
      // Redirect or show unauthorized
      router.replace("/unauthorized");
    }
  }, [token, userRole, requiredRole, router]);

  if (!token || userRole !== requiredRole) {
    return null; // Or a spinner, or unauthorized message
  }

  return <>{children}</>;
};

export default ProtectedRoute;
