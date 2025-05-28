import { Navigate, Route, Routes } from "react-router";
import Registro from "./pages/auth/registro/Registro";
import NotFound from "./pages/not-found/NotFound";
import Login from "./pages/auth/login/Login";
import Unauthorized from "./pages/unauthorized/Unauthorized";
import Home from "./pages/home/Home";
import ProtectedRoute from "./components/protecated-route/ProtectedRoute";
import Loader from "./pages/loader/Loader";
import Studio from "./pages/studio/Studio";
import GerenciarPodcasts from "./pages/podcasts/GerenciarPodcasts";
import GerenciarMonitores from "./pages/podcasts/GerenciarMonitores";

function App() {
  return (
    <>
      <Routes>
        {/* Auth */}
        <Route path="/registro" element={<Registro />} />
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<Navigate to={"/login"} />} />

        {/* rotas protegidas */}
        <Route element={<ProtectedRoute roles={["PROFESSOR", "ALUNO"]} />}>
          <Route path="/home" element={<Home />} />
          <Route path="/studio" element={<Studio />} />
          <Route
            path="/studio/podcasts/gerenciar"
            element={<GerenciarPodcasts />}
          />
          <Route
            path="/studio/monitores/gerenciar"
            element={<GerenciarMonitores />}
          />
          <Route
            path="/studio/notificacoes"
            element={<div>Notificações</div>}
          />
        </Route>

        {/* rotas especiais */}
        <Route path="*" element={<NotFound />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/loader" element={<Loader />} />
      </Routes>
    </>
  );
}

export default App;
