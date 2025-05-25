import { Request, Response } from "express";

export const logout = async (req: Request, res: Response) => {
  res.clearCookie("token").clearCookie("refreshToken").status(200).json({
    status: "ok",
    message: "Logout realizado com sucesso",
    title: "Logout",
  });
};
