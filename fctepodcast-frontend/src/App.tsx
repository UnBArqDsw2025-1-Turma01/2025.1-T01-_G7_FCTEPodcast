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
import ComentariosEpisodio from "./pages/comentarios-episodio/ComentariosEpisodio";
import MinhaBiblioteca from "./pages/minha-biblioteca/MinhaBiblioteca";
import Curtidas from "./pages/curtidas/Curtidas";
import DetalhesPodcast from "./pages/detalhes-podcast/DetalhesPodcast";
import Notificacoes from "./pages/notificacoes/Notificacoes";
import Perfil from "./pages/perfil/Perfil";
import EditarPerfil from "./pages/editar-perfil/EditarPerfil";

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

          {/* 
          <Route path="/tmp" element={<PodcastView />} /> */}
          <Route
            path="/:episodio_id/comentarios"
            element={<ComentariosEpisodio />}
          />

          <Route path="/biblioteca" element={<MinhaBiblioteca />} />

          <Route path="/curtidas/:usuario_id" element={<Curtidas />} />

          <Route path="/podcast/:podcast_id" element={<DetalhesPodcast />} />

          {/* <Route path="/meu-perfil" element={<MeuPerfil />} /> */}
          <Route path="/perfil/:usuario_id" element={<Perfil />} />

          <Route path="/usuario/perfil/editar" element={<EditarPerfil />} />
        </Route>

        <Route element={<ProtectedRoute roles={["PROFESSOR"]} />}>
          <Route
            path="/studio/podcasts/gerenciar"
            element={<GerenciarPodcasts />}
          />

          <Route
            path="/studio/monitores/gerenciar"
            element={<GerenciarMonitores />}
          />

          <Route path="/studio/notificacoes" element={<Notificacoes />} />
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
