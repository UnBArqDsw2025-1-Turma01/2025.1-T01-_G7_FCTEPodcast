import { Request, Response } from "express";
import { UsuarioController } from "../controller/UsuarioController";
import { JWTService } from "../services/JWTService";
import { NextFunction, RequestHandler } from "express-serve-static-core";

// FACADE: AuthFacade
// AuthFacade é uma fachada que encapsula a logica de autenticação e autorização
// expondo uma interface simples para lider com requisições seguras.
// "A Facade provê uma interface simplificada para um conjunto complexo de classes."
// a interface simples é o método handleSecureRequest, que recebe uma lista de roles permitidas e um handler para a requisição.
// e os subsistemas são o JWTService e o UsuarioController, que lidam com a validação do token e a obtenção do usuário respectivamente.

// --- Facade: AuthFacade ---
export class AuthFacade {
  private jwtService: JWTService;
  private usuarioService: UsuarioController;

  constructor(jwtService?: JWTService, usuarioService?: UsuarioController) {
    this.jwtService = jwtService || new JWTService();
    this.usuarioService = usuarioService || new UsuarioController();
  }

  public handleSecureRequest(
    allowedRoles: string[],
    handler: (req: Request, res: Response) => Promise<void>
  ): RequestHandler {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return async (req: Request, res: Response, next: NextFunction) => {
      const token = this.jwtService.getTokenFromRequest(req);
      if (!token) {
        res.status(403).json({ error: "Acesso negado. Token não fornecido." });
        return;
      }

      const decoded = await this.jwtService.validateToken(token);
      if (!decoded) {
        res.status(403).json({ error: "Acesso negado. Token inválido." });
        return;
      }

      const usuario = await this.usuarioService.getUsuarioById_Internal(
        decoded.id as string
      );
      if (!usuario) {
        res
          .status(403)
          .json({ error: "Acesso negado. Usuário não encontrado." });
        return;
      }

      if (!usuario.role || !allowedRoles.includes(usuario.role)) {
        res
          .status(403)
          .json({ error: "Acesso negado. Permissão insuficiente." });
        return;
      }

      if (typeof req.body !== "object" || req.body === null) {
        req.body = {};
      }

      req.body.usuario_id = usuario.id;

      try {
        await handler(req, res);
      } catch (error) {
        console.error("Erro ao processar requisição:", error);
        res.status(500).json({ error: "Erro interno do servidor." });
      }
    };
  }
}

// Adaptações
// * Integração com Express (Middleware)
// A fachada retorna um RequestHandler, pois no mundo do Express, a forma de "encapsular lógica" é por middlewares.
// * Injeção de dependências via construtor com fallback
// Permite testar a fachada com mocks, ou usar os serviços reais. Excelente prática de desacoplamento.
