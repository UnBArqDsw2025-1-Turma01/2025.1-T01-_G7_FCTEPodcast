jest.mock("../../config/connect_db", () => {
  return jest.fn(() => Promise.resolve());
});
import request from "supertest";
import { app } from "../../app";

describe("Teste para a rota POST /usuario/logout", () => {
  it("Deve retornar 200 e limpar os cookies de autenticação", async () => {
    const response = await request(app).post("/api/usuario/logout").send();

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "ok",
      message: "Logout realizado com sucesso",
      title: "Logout",
    });

    const setCookieHeader = response.headers["set-cookie"];
    expect(setCookieHeader).toBeDefined();

    // Ensure setCookieHeader is always an array
    const cookiesArray = Array.isArray(setCookieHeader)
      ? setCookieHeader
      : [setCookieHeader];

    const tokenCookie = cookiesArray.find((cookie: string) => {
      return cookie.startsWith("token=");
    });

    const refreshTokenCookie = cookiesArray.find((cookie: string) => {
      return cookie.startsWith("refreshToken=");
    });

    expect(tokenCookie).toMatch(/Max-Age=0|Expires=/i);
    expect(refreshTokenCookie).toMatch(/Max-Age=0|Expires=/i);
  });
});
