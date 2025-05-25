import express from "express";
import { registrar_professor } from "../../services/usuario/auth/registrar_professor";
import { professor_register_validation } from "../../middleware/validations/usuario/professor_register_validation";
import { validate } from "../../middleware/validations/handle_validations";
import { aluno_register_validation } from "../../middleware/validations/usuario/aluno_register_validation";
import { registrar_aluno } from "../../services/usuario/auth/registrar_aluno";
import { login } from "../../services/usuario/auth/login";
import { logout } from "../../services/usuario/auth/logout";
import { refresh_session } from "../../services/usuario/auth/refresh_session";

const usuario_router = express.Router();

// autenticacao
usuario_router.post(
  "/professor/registrar",
  professor_register_validation(),
  validate,
  registrar_professor
);
usuario_router.post(
  "/aluno/registrar",
  aluno_register_validation(),
  validate,
  registrar_aluno
);

// login e logout
usuario_router.post("/login", login);
usuario_router.post("/logout", logout);
usuario_router.post("/refresh", refresh_session);

export default usuario_router;
