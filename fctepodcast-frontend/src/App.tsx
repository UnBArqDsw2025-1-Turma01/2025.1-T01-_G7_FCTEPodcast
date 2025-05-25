import { Navigate, Route, Routes } from "react-router";
import Registro from "./pages/auth/registro/Registro";
import NotFound from "./pages/not-found/NotFound";
import Login from "./pages/auth/login/Login";

function App() {
  return (
    <>
      <Routes>
        {/* Auth */}
        <Route path="/registro" element={<Registro />} />
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<Navigate to={"/login"} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
