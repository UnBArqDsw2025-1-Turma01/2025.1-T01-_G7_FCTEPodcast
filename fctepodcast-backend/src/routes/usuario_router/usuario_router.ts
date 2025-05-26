import express from "express";
import { validate } from "../../middleware/validations/handle_validations";
import { validacao_registro_usuario } from "../../middleware/validations/usuario/usuario_register_validation";
import { UsuarioController } from "../../controller/UsuarioController";

const usuario_router = express.Router();

// controllers
const usuario_controller = new UsuarioController();

// autenticacao
usuario_router.post(
  "/registrar",
  validacao_registro_usuario(),
  validate,
  usuario_controller.registrar
);
usuario_router.post("/login", usuario_controller.login);
usuario_router.post("/logout", usuario_controller.logout);
usuario_router.post("/refresh", usuario_controller.refresh_session);

export default usuario_router;
