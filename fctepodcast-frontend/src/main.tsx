import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { BrowserRouter } from "react-router";
import { AuthProvider } from "./context/auth/AuthContext.tsx";
import Loader from "./pages/loader/Loader.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <HeroUIProvider>
        <Suspense fallback={<Loader />}>
          <AuthProvider>
            <main className="dark text-foreground bg-background h-screen">
              <ToastProvider />
              <App />
            </main>
          </AuthProvider>
        </Suspense>
      </HeroUIProvider>
    </BrowserRouter>
  </StrictMode>
);
