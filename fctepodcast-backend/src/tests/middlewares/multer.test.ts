import request from "supertest";
import express, { Request, Response } from "express";
import { upload } from "../../middleware/multer/multer";
import path from "path";

describe("Teste de upload de arquivo", () => {
  let app: express.Express;

  beforeEach(() => {
    app = express();

    app.post(
      "/upload",
      upload.single("file"),
      (req: Request, res: Response) => {
        if (!req.file) {
          res.status(400).json({
            error: "Nenhum arquivo foi enviado.",
          });
          return;
        }

        res.status(200).json({
          file: req.file,
        });
      }
    );

    app.use(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (err: Error, req: Request, res: Response, next: express.NextFunction) => {
        res.status(500).json({
          error: err.message,
        });
      }
    );
  });

  it("Deve fazer upload de um arquivo com sucesso", async () => {
    const response = await request(app)
      .post("/upload")
      .attach("file", path.resolve(__dirname, "../mocks/mock_image.png"));

    expect(response.status).toBe(200);
    expect(response.body.file).toBeDefined();
  });

  it("Deve retornar erro se nenhum arquivo for enviado", async () => {
    const response = await request(app).post("/upload");

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Nenhum arquivo foi enviado.");
  });

  it("Deve retornar erro se o arquivo for inválido", async () => {
    const response = await request(app)
      .post("/upload")
      .attach("file", path.resolve(__dirname, "../mocks/invalid_file.txt"));

    expect(response.status).toBe(500);
    expect(response.body.error).toBe(
      "Apenas arquivos MP3 ou imagens são permitidos."
    );
  });
});
