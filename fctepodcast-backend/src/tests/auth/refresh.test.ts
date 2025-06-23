import request from "supertest";
import jwt from "jsonwebtoken";
import { app } from "../../app";
import { Usuario } from "../../models/Usuario";

jest.mock("../../config/connect_db", () => {
  return jest.fn(() => Promise.resolve());
});

jest.mock("../../models/Usuario");

describe("Teste para a rota POST /usuario/refresh", () => {
  const mockUser = {
    _id: "1234567890abcdef12345678",
    email: "teste@unb.br",
    role: "PROFESSOR",
    nome: "Teste User",
  };

  const JWT_SECRET = "TESTE_SECRET";
  const JWT_REFRESH_SECRET_KEY = "REFRESH_TESTE";

  beforeAll(() => {
    process.env.JWT_SECRET_KEY = JWT_SECRET;
    process.env.JWT_REFRESH_SECRET_KEY = JWT_REFRESH_SECRET_KEY;
  });

  const refreshToken = jwt.sign({ id: mockUser._id }, JWT_REFRESH_SECRET_KEY);

  (Usuario.findById as jest.Mock).mockResolvedValue(mockUser);

  it("deve atualizar a sessão do usuário com um refresh token válido", async () => {
    const response = await request(app)
      .post("/api/usuario/refresh")
      .set("Cookie", [`refresh_token=${refreshToken}`])
      .send();
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "success",
      message: "Sessão atualizada com sucesso",
      title: "Sessão atualizada com sucesso",
      usuario: {
        id: mockUser._id,
        nome: mockUser.nome,
        email: mockUser.email,
        role: mockUser.role,
      },
    });
  });
});
