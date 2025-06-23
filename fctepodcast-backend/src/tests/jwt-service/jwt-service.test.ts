import { JWTService } from "../../services/JWTService";
import jwt from "jsonwebtoken";
import { Request } from "express";

jest.mock("jsonwebtoken");

describe("Teste do JWTService", () => {
  let jwtService: JWTService;

  beforeEach(() => {
    jwtService = new JWTService();
    process.env.JWT_SECRET_KEY = "chave_teste"; // Define variável de ambiente
  });

  describe("getTokenFromRequest", () => {
    it("Deve retornar o token do cookie como access_token", () => {
      const mockreq = {
        cookies: {
          access_token: "token123",
        },
      } as unknown as Request;

      const token = jwtService.getTokenFromRequest(mockreq);
      expect(token).toBe("token123");
    });

    it("deve retornar null se cookie access_token não existir", () => {
      const mockReq = {
        cookies: {},
      } as unknown as Request;

      const token = jwtService.getTokenFromRequest(mockReq);
      expect(token).toBeNull();
    });
  });

  describe("validateToken", () => {
    it("deve retornar o payload decodificado se token for válido", async () => {
      (jwt.verify as jest.Mock).mockReturnValue({ id: "usuario123" });

      const result = await jwtService.validateToken("token_valido");
      expect(jwt.verify).toHaveBeenCalledWith(
        "token_valido",
        expect.any(String)
      );
      expect(result).toEqual({ id: "usuario123" });
    });

    it("deve retornar null se o token for inválido e logar erro", async () => {
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      // Faz com que jwt.verify lance erro para simular token inválido
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error("Token inválido");
      });

      const result = await jwtService.validateToken("token_invalido");
      expect(result).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Token inválido:",
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });
  });
});
