import { Outlet, useNavigate } from "react-router";
import { useAuth } from "../../context/auth/AuthContext";
import { useEffect } from "react";
import NavBar from "../navbar/NavBar";
import SideBar from "../sidebar/SideBar";
import PlayBar from "../playbar/PlayBar";

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

  return (
    <div className="h-screen flex flex-col">
      <NavBar />
      <div className="flex flex-1 overflow-hidden">
        <SideBar />
        <div className="flex-1 p-6 overflow-auto pb-24">
          <Outlet />
        </div>
      </div>
      <PlayBar />
    </div>
  );
};

export default ProtectedRoute;
