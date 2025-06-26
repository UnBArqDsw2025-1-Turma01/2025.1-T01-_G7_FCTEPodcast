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
    if (user === null) {
      // Usuário não autenticado, manda para login
      navigate("/login");
    } else if (user && roles && !roles.includes(user.role)) {
      // Usuário sem permissão, manda para unauthorized
      navigate("/unauthorized");
    }
  }, [user, roles, navigate]);

  // Opcional: se quiser evitar renderizar o conteúdo antes de confirmar usuário,
  // pode retornar null ou um loader aqui enquanto o user é undefined (loading)
  if (user === undefined) return null;

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
