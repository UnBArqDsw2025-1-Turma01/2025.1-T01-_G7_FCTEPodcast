import express from "express";
import { validate } from "../../middleware/validations/handle_validations";
import { validacao_registro_usuario } from "../../middleware/validations/usuario/usuario_register_validation";
import { UsuarioController } from "../../controller/UsuarioController";
import { PodcastController } from "../../controller/PodcastController";
import { upload } from "../../middleware/multer/multer";
import { EpisodioController } from "../../controller/EpisodioController";
import { ArchiveAdapter, ArchiveFileSystem } from "../../adapter/ImageAdapter";
import { AuthFacade } from "../../facade/AuthFacade";
import { JWTService } from "../../services/JWTService";

const usuario_router = express.Router();

// Aqui estão as maiores adaptações feitas para o contexto do Express.js e TypeScript:
// * Uso do Express Router para Organização de Rotas
// Express Router permite modularizar rotas por domínio (ex.: /usuarios, /podcasts, etc).
// * Tratamento Assíncrono e Erros com async/await
// Captura e resposta adequada para erros via middleware ou blocos try/catch.
// * DTOs e Tipagem Estrita
// Usar DTOs (objetos simples) para transferência de dados entre camadas.
// * Chamda de Métodos
// Geralmente, as rotas são implementadas usando funções simples (handlers), ao contrário de classes complexas.

// controllers
const usuario_controller = new UsuarioController();
const podcast_controller = new PodcastController();
const episodio_controller = new EpisodioController();

// services
const jwtService = new JWTService();

// adapters
const acrhiveFileSystem = new ArchiveFileSystem("/app/uploads");
const archiveProvider = new ArchiveAdapter(acrhiveFileSystem);

// facade
const authFacade = new AuthFacade(jwtService, usuario_controller);

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
  authFacade.handleSecureRequest(["PROFESSOR"], podcast_controller.criarPodcast)
);

// podcasts
usuario_router.get(
  "/podcasts/:usuario_id",
  authFacade.handleSecureRequest(
    ["PROFESSOR", "ALUNO"],
    podcast_controller.listarPodcastsUsuario
  )
);

// rota publica para obter todos os podcasts TEMPORARIA
usuario_router.get("/podcasts", podcast_controller.listarTodosPodcasts);

// episodios
usuario_router.post(
  "/episodio/criar",
  upload.single("audio"),
  authFacade.handleSecureRequest(
    ["PROFESSOR"],
    episodio_controller.criarEpisodio
  )
);
usuario_router.get(
  "/episodios/:episodio_id/reference",
  authFacade.handleSecureRequest(
    ["PROFESSOR", "ALUNO"],
    episodio_controller.getReferenceData
  )
);
usuario_router.get(
  "/episodio/:episodio_id/image",
  authFacade.handleSecureRequest(
    ["PROFESSOR", "ALUNO"],
    episodio_controller.getImage
  )
);

usuario_router.get("/image/", async (req, res) => {
  const { path: imagePath } = req.query;

  if (!imagePath) {
    res.status(400).json({ error: "Parâmetro 'path' é obrigatório" });
    return;
  }

  await archiveProvider.getImage(imagePath as string, res);
});

export default usuario_router;
