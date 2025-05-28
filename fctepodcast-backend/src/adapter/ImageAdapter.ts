import path from "path";
import fs from "fs";
import { Response } from "express";

interface ImageProvider {
  getImage(image_path: string, res: Response): Promise<void>;
}

export class ImageFileSystem {
  baseDir: string;
  constructor(baseDir: string) {
    this.baseDir = baseDir;
  }

  getFullPath(fullRequestPath: string) {
    // Garante que o path começa com /app/uploads/
    if (!fullRequestPath.startsWith("/app/uploads/")) {
      throw new Error("Path inválido");
    }

    const relativePath = fullRequestPath.replace("/app/uploads/", "");
    const safePath = path
      .normalize(relativePath)
      .replace(/^(\.\.(\/|\\|$))+/, "");
    return path.join(this.baseDir, safePath);
  }

  imageExists(fullPath: string) {
    return fs.existsSync(fullPath);
  }

  sendImage(fullPath: string, res: Response) {
    res.sendFile(fullPath);
  }
}

export class ImageAdapter implements ImageProvider {
  constructor(private imageFileSystem: ImageFileSystem) {
    this.imageFileSystem = imageFileSystem;
  }

  async getImage(imagePath: string, res: Response) {
    try {
      const fullPath = this.imageFileSystem.getFullPath(imagePath);

      if (!this.imageFileSystem.imageExists(fullPath)) {
        res.status(404).json({ error: "Imagem não encontrada" });
        return;
      }

      this.imageFileSystem.sendImage(fullPath, res);
    } catch (err) {
      if (err instanceof Error) {
        res.status(400).json({ error: err.message });
      } else {
        res.status(400).json({ error: "Ocorreu um erro desconhecido" });
      }
    }
  }
}
