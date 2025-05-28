import { NextFunction, Response, Request } from "express";
import jwt from "jsonwebtoken";
import { Usuario } from "../models/Usuario";

// Este proxy serve para controlar o acesso a rotas especificas da API
// baseado em um token JWT e nas permissões do usuário.
// Ele implementa o padrão Proxy, onde o acesso a um serviço real (JWTService)
// é controlado por um proxy (AuthProxy).
// O AuthProxy verifica se o token é válido e se o usuário tem a permissão necessária
// para acessar a rota, antes de delegar a chamada ao serviço real.
// também isola a lógica de autenticação do serviço real, permitindo que o AuthProxy
// seja reutilizado em diferentes contextos ou serviços, mantendo a lógica de autenticação
// separada da lógica de negócios do serviço real.

// Interface do serviço de token
interface JWTServiceSubject {
  validateToken(token: string): Promise<jwt.JwtPayload | null>;
  getTokenFromRequest(req: Request): string | null;
}

// Serviço real de autenticação
class JWTService implements JWTServiceSubject {
  public getTokenFromRequest(req: Request): string | null {
    const token = req.cookies.access_token;
    return token || null;
  }

  public async validateToken(token: string): Promise<jwt.JwtPayload | null> {
    try {
      const decoded = (await jwt.verify(
        token,
        process.env.JWT_SECRET_KEY as string
      )) as jwt.JwtPayload;
      return decoded;
    } catch (error) {
      console.error("Token inválido:", error);
      return null;
    }
  }
}

// Tipo para handlers do Express
type Handler = (req: Request, res: Response) => Promise<void>;

// Proxy que controla acesso
export class AuthProxy implements JWTServiceSubject {
  private jwtService = new JWTService();

  constructor(private allowedRoles: string[], private realSubject: Handler) {}

  // Middleware exposto ao Express
  public handleRequest = async (req: Request, res: Response): Promise<void> => {
    const token = this.getTokenFromRequest(req);
    if (!token) {
      res.status(403).json({ error: "Acesso negado. Token não fornecido." });
      return;
    }

    const decodedToken = await this.validateToken(token);
    if (!decodedToken) {
      res.status(403).json({ error: "Acesso negado. Token inválido." });
      return;
    }

    const usuario = await Usuario.findById(decodedToken.id);
    if (!usuario) {
      res.status(403).json({ error: "Acesso negado. Usuário não encontrado." });
      return;
    }

    if (!usuario.role || !this.allowedRoles.includes(usuario.role)) {
      res.status(403).json({ error: "Acesso negado. Permissão insuficiente." });
      return;
    }

    try {
      await this.realSubject(req, res);
    } catch (error) {
      console.error("Erro ao processar a requisição:", error);
      res.status(500).json({ error: "Erro interno do servidor." });
      return;
    }
  };

  // Métodos delegados para o JWTService
  public getTokenFromRequest(req: Request): string | null {
    return this.jwtService.getTokenFromRequest(req);
  }

  public async validateToken(token: string): Promise<jwt.JwtPayload | null> {
    return this.jwtService.validateToken(token);
  }
}
