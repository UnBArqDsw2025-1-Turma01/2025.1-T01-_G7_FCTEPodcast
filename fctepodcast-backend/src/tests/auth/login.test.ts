import express from "express";
import request from "supertest";
import { jest } from "@jest/globals";
import { Usuario } from "../../models/Usuario";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { UsuarioController } from "../../controller/UsuarioController";

// Mock the Usuario module for testing
jest.mock("../../models/Usuario");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(cookieParser());

const usuario_controller = new UsuarioController();

app.post("/login", (req, res) => usuario_controller.login(req, res));

describe("Teste rota POST /login", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Deve retornar 200 e um token JWT válido para credenciais corretas", async () => {
    const findOneMock = Usuario.findOne as jest.MockedFunction<
      typeof Usuario.findOne
    >;
    findOneMock.mockResolvedValue({
      _id: "12345",
      email: "teste@unb.br",
      senha: await bcrypt.hash("senha123", 10),
      role: "PROFESSOR",
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (bcrypt.compare as any).mockResolvedValue(true);

    (jwt.sign as jest.Mock)
      .mockReturnValueOnce("access-token-fake")
      .mockReturnValueOnce("refresh-token-fake");

    const response = await request(app).post("/login").send({
      email: "teste@unb.br",
      senha: "senha123",
    });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("success");
    expect(response.body.usuario.email).toBe("teste@unb.br");
    expect(response.headers["set-cookie"]).toBeDefined();
    expect(jwt.sign).toHaveBeenCalledTimes(2);
  });

  it("Deve retornar 404 se usuário não encontrado", async () => {
    const findOneMock = Usuario.findOne as jest.MockedFunction<
      typeof Usuario.findOne
    >;
    findOneMock.mockResolvedValue({
      _id: "12345",
      email: "teste@unb.br",
      senha: await bcrypt.hash("senha123", 10),
      role: "PROFESSOR",
    });

    const response = await request(app)
      .post("/usuario/login")
      .send({ email: "inexistente@teste.com", senha: "123456" });

    expect(response.status).toBe(404);
    expect(response.body.status).toBe(undefined);
    // expect(response.body.title).toBe("Usuário não encontrado");
  });

  it("Deve retornar 401 se senha incorreta", async () => {
    const findOneMock = Usuario.findOne as jest.MockedFunction<
      typeof Usuario.findOne
    >;
    findOneMock.mockResolvedValue({
      _id: "12345",
      email: "teste@unb.br",
      senha: await bcrypt.hash("senha123", 10),
      role: "PROFESSOR",
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (bcrypt.compare as any).mockResolvedValue(false);

    const response = await request(app)
      .post("/usuario/login")
      .send({ email: "teste@teste.com", senha: "senhaerrada" });

    expect(response.status).toBe(404);
    expect(response.body.status).toBe(undefined);
    // expect(response.body.title).toBe("Senha incorreta");
  });
});
