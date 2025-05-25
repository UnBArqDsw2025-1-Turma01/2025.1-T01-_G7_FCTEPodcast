import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { BrowserRouter } from "react-router";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <HeroUIProvider>
        <main className="dark text-foreground bg-background h-screen">
          <ToastProvider />
          <App />
        </main>
      </HeroUIProvider>
    </BrowserRouter>
  </StrictMode>
);
