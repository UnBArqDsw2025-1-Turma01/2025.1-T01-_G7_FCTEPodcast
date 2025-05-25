import express from "express";
import { validate } from "../../middleware/validations/handle_validations";
import { login } from "../../services/usuario/auth/login";
import { logout } from "../../services/usuario/auth/logout";
import { refresh_session } from "../../services/usuario/auth/refresh_session";
import { registrar_usuario } from "../../services/usuario/auth/usuario_factory/registrar_usuario";
import { validacao_registro_usuario } from "../../middleware/validations/usuario/usuario_register_validation";

const usuario_router = express.Router();

// autenticacao

usuario_router.post(
  "/registrar",
  validacao_registro_usuario(),
  validate,
  registrar_usuario
);

// usuario_router.post(
//   "/professor/registrar",
//   professor_register_validation(),
//   validate,
//   registrar_professor
// );
// usuario_router.post(
//   "/aluno/registrar",
//   aluno_register_validation(),
//   validate,
//   registrar_aluno
// );

// login e logout
usuario_router.post("/login", login);
usuario_router.post("/logout", logout);
usuario_router.post("/refresh", refresh_session);

export default usuario_router;
