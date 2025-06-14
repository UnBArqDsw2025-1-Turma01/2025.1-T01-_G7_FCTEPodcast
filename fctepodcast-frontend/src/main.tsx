import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { BrowserRouter } from "react-router";
import { AuthProvider } from "./context/auth/AuthContext.tsx";
import Loader from "./pages/loader/Loader.tsx";
import { PlayerProvider } from "./context/player/PlayerContext.tsx";

// aqui se importa o ReactDOM para renderizar a aplicação
// Quando o react encontra o AuthProvider, ele executa o componente de função
// cria um estado local com o hook useState para armazenar o usuário autenticado
// como o AuthProvider é um componente de função, ele pode usar hooks do React
// e o componente AuthProvider é usado para envolver toda a aplicação
// assim, o estado de autenticação pode ser acessado em qualquer lugar da aplicação
// com seus estados sempre atualizados e sincronizados com o contexto de autenticação.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <HeroUIProvider>
        <Suspense fallback={<Loader />}>
          <PlayerProvider>
            <AuthProvider>
              <main className="dark text-foreground bg-background h-screen">
                <ToastProvider />
                <App />
              </main>
            </AuthProvider>
          </PlayerProvider>
        </Suspense>
      </HeroUIProvider>
    </BrowserRouter>
  </StrictMode>
);
