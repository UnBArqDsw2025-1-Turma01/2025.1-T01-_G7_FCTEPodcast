import path from "path";
import fs from "fs";
import { Response } from "express";

// Interface para o provedor de arquivos de imagem
// Esta interface define os métodos que o provedor de arquivos de imagem deve implementar.
// Ela permite que o sistema interaja com diferentes implementações de provedores de arquivos de imagem,
// garantindo que todos os provedores implementem os métodos necessários para obter imagens.
interface ArchiveProvider {
  getImage(image_path: string, res: Response): Promise<void>;
}

// Classe que implementa o sistema de arquivos para gerenciar imagens
// Esta classe é responsável por gerenciar o sistema de arquivos onde as imagens são armazenadas.
// Ela fornece métodos para obter o caminho completo de uma imagem, verificar se a imagem existe
// e enviar a imagem, após a conversão para Blob como resposta HTTP.
export class ArchiveFileSystem {
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

// Este adapter implementa a interface ArchiveProvider e utiliza internamente uma instância de ArchiveFileSystem.
// Ele adapta a interface esperada pelo cliente (getImage(imagePath, res)) para interagir com o sistema de arquivos, verificando se a imagem solicitada existe.
// Se a imagem existir, o adapter envia o arquivo como resposta HTTP; caso contrário, retorna um erro 404.
// Além disso, ele trata possíveis erros durante o processo, respondendo com mensagens JSON apropriadas ao cliente.
export class ArchiveAdapter implements ArchiveProvider {
  constructor(private imageFileSystem: ArchiveFileSystem) {
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

// Adaptações
// * Uso do Express e Http como contexto
// o adapter está adaptando uma interface relacionada a requisições HTTP e arquivos, que é um contexto real e prático para web backend.
// * Tratamento de erros e respostas HTTP
//  o adapter não só traduz interface, mas também traduz erros para respostas JSON, algo específico para API REST.
