import request from "supertest";
import { creatorRegistry } from "../../factory/usuario/CreatorRegistry";
import { app } from "../../app";

jest.mock("../../config/connect_db", () => {
  return jest.fn(() => Promise.resolve());
});

describe("Teste para a rota POST /usuario/register", () => {
  let createSpyAluno: jest.SpyInstance;
  let createSpyProfessor: jest.SpyInstance;

  beforeEach(() => {
    createSpyAluno = jest
      .spyOn(creatorRegistry["ALUNO"], "create")
      .mockResolvedValue(undefined);
    createSpyProfessor = jest
      .spyOn(creatorRegistry["PROFESSOR"], "create")
      .mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Deve registrar um aluno com sucesso", async () => {
    const response = await request(app).post("/api/usuario/registrar").send({
      nome: "Fulano Aluno",
      email: "fulano@aluno.unb.br",
      senha: "senha123",
      role: "ALUNO",
    });

    expect(response.status).toBe(201);
    expect(response.body.status).toBe("success");
    expect(createSpyAluno).toHaveBeenCalledWith(
      "Fulano Aluno",
      "fulano@aluno.unb.br",
      "senha123"
    );
  });

  it("Deve registrar um professor com sucesso", async () => {
    const response = await request(app).post("/api/usuario/registrar").send({
      nome: "Professor X",
      email: "professor@unb.br",
      senha: "12345",
      role: "PROFESSOR",
    });

    expect(response.status).toBe(201);
    expect(response.body.status).toBe("success");
    expect(createSpyProfessor).toHaveBeenCalledWith(
      "Professor X",
      "professor@unb.br",
      "12345"
    );
  });
});
