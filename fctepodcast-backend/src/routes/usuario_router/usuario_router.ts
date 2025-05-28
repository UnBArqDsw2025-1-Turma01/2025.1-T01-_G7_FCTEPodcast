import express from "express";
import { validate } from "../../middleware/validations/handle_validations";
import { validacao_registro_usuario } from "../../middleware/validations/usuario/usuario_register_validation";
import { UsuarioController } from "../../controller/UsuarioController";
import { AuthProxy } from "../../proxy/AuthProxy";
import { PodcastController } from "../../controller/PodcastController";
import { upload } from "../../middleware/multer/multer";

const usuario_router = express.Router();

// controllers
const usuario_controller = new UsuarioController();
const podcast_controller = new PodcastController();

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

// professor
usuario_router.post(
  "/podcast/criar",
  upload.single("image"),
  new AuthProxy(["PROFESSOR"], podcast_controller.criarPodcast).handleRequest
);

// podcasts
usuario_router.get(
  "/podcasts/:usuario_id",
  new AuthProxy(
    ["PROFESSOR", "ALUNO"],
    podcast_controller.listarPodcastsUsuario
  ).handleRequest
);

export default usuario_router;
