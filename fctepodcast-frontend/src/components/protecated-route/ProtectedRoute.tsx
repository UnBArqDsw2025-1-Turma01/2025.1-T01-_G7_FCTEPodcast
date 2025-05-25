import { Outlet, useNavigate } from "react-router";
import { useAuth } from "../../context/auth/AuthContext";
import { useEffect } from "react";

const ProtectedRoute = ({ roles }: { roles: string[] }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
    if (user && roles && !roles.includes(user.role)) {
      navigate("/unauthorized");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return <Outlet />;
};

export default ProtectedRoute;
