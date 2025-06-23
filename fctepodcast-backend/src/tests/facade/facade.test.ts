import express, { Router } from "express";
import { AuthFacade } from "../../facade/AuthFacade";
import { JWTService } from "../../services/JWTService";
import { UsuarioController } from "../../controller/UsuarioController";
import { PodcastController } from "../../controller/PodcastController";
import Podcast from "../../models/Podcast";
import request from "supertest";

jest.mock("../../services/JWTService");
jest.mock("../../controller/UsuarioController");
jest.mock("../../models/Podcast");

describe("Teste do Facade", () => {
  let app: express.Express;
  let authFacade: AuthFacade;
  let jwtServiceMock: jest.Mocked<JWTService>;
  let usuarioControllerMock: jest.Mocked<UsuarioController>;
  const podcast_controller = new PodcastController();

  beforeEach(() => {
    app = express();

    jwtServiceMock = new JWTService() as jest.Mocked<JWTService>;
    usuarioControllerMock =
      new UsuarioController() as jest.Mocked<UsuarioController>;

    jwtServiceMock.getTokenFromRequest.mockImplementation((req) => {
      const auth = req.headers["authorization"];
      if (auth && typeof auth === "string" && auth.startsWith("Bearer ")) {
        return auth.slice(7);
      }
      return null;
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jwtServiceMock.validateToken.mockResolvedValue({ id: "usuario123" } as any);

    // Aqui o mock essencial para autorização passar:
    usuarioControllerMock.getUsuarioById_Internal.mockResolvedValue({
      _id: "usuario123",
      nome: "Usuário Teste",
      email: "teste@unb.br",
      senha: "senha123",
      playlists: [],
      curtidas: [],
      podcasts_seg: [],
      ativo: true,
      role: "ALUNO",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    authFacade = new AuthFacade(jwtServiceMock, usuarioControllerMock);

    const router = Router();
    router.get(
      "/podcasts/:usuario_id",
      authFacade.handleSecureRequest(
        ["PROFESSOR", "ALUNO"],
        podcast_controller.listarPodcastsUsuario
      )
    );

    app.use("/api/usuario", router);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Deve retornar 200 com a lista de podcasts do usuario", async () => {
    const podcastsMock = [
      {
        _id: "podcast1",
        titulo: "Podcast 1",
        imagem_path: "path/to/image1.jpg",
        descricao: "Descrição do Podcast 1",
        co_autores: [],
        autor: "usuario123",
        episodios: [],
        tags: ["tag1", "tag2"],
      },
    ];

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const mockPopulate = jest.fn().mockReturnThis();

    const mockFind = {
      populate: jest
        .fn()
        .mockReturnThis()
        .mockReturnValue({
          populate: jest
            .fn()
            .mockReturnThis()
            .mockReturnValue({
              populate: jest.fn().mockResolvedValue(podcastsMock),
            }),
        }),
    };

    (Podcast.find as jest.Mock).mockReturnValue(mockFind);

    const response = await request(app)
      .get("/api/usuario/podcasts/usuario123")
      .set("Authorization", "Bearer valid_token");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("success");
    expect(response.body.podcasts).toHaveLength(1);
    expect(response.body.podcasts[0].titulo).toBe("Podcast 1");
  });

  it("Deve retornar 403 se não enviar token", async () => {
    const response = await request(app).get("/api/usuario/podcasts/usuario123");
    expect(response.status).toBe(403);
    expect(response.body.error).toBe("Acesso negado. Token não fornecido.");
  });

  it("Deve retornar 403 se o token for inválido", async () => {
    jwtServiceMock.getTokenFromRequest.mockReturnValue("invalid_token");
    jwtServiceMock.validateToken.mockResolvedValue(null);

    const response = await request(app)
      .get("/api/usuario/podcasts/usuario123")
      .set("Authorization", "Bearer invalid_token");

    expect(response.status).toBe(403);
    expect(response.body.error).toBe("Acesso negado. Token inválido.");
  });

  it("Deve retornar 403 se o usuário não for encontrado", async () => {
    usuarioControllerMock.getUsuarioById_Internal.mockResolvedValue(null);

    const response = await request(app)
      .get("/api/usuario/podcasts/usuario123")
      .set("Authorization", "Bearer valid_token");

    expect(response.status).toBe(403);
    expect(response.body.error).toBe("Acesso negado. Usuário não encontrado.");
  });

  it("Deve retornar 403 se o usuário não tiver role autorizada", async () => {
    usuarioControllerMock.getUsuarioById_Internal.mockResolvedValue({
      _id: "usuario123",
      nome: "Usuário Teste",
      email: "teste@unb.br",
      senha: "senha123",
      playlists: [],
      curtidas: [],
      podcasts_seg: [],
      ativo: true,
      role: null,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    const response = await request(app)
      .get("/api/usuario/podcasts/usuario123")
      .set("Authorization", "Bearer valid_token");

    expect(response.status).toBe(403);
    expect(response.body.error).toBe("Acesso negado. Permissão insuficiente.");
  });
});
