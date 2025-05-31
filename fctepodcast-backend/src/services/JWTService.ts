import { Request } from "express";
import jwt from "jsonwebtoken";

// Servico JWTService
// Este serviço é responsável por lidar com a autenticação baseada em JWT (JSON Web Tokens).
// Ele extrai o token do cookie da requisição e valida o token usando uma chave secreta.
// Ele também lida com erros de validação, retornando null se o token for inválido.
// É Usado pelo AuthFacade para proteger rotas e garantir que apenas usuários autenticados possam acessar recursos protegidos.
export class JWTService {
  public getTokenFromRequest(req: Request): string | null {
    return req.cookies.access_token || null;
  }

  public async validateToken(token: string): Promise<jwt.JwtPayload | null> {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY as string
      ) as jwt.JwtPayload;
      return decoded;
    } catch (error) {
      console.error("Token inválido:", error);
      return null;
    }
  }
}
