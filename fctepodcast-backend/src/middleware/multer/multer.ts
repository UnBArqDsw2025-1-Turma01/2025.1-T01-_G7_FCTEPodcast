import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { Request } from "express";
import fs from "fs";

// Diretório de upload
const uploadDir = path.join(__dirname, "../../../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Limites em bytes
const MAX_AUDIO_SIZE = 100 * 1024 * 1024; // 100MB
const MAX_IMAGE_SIZE = 50 * 1024 * 1024; // 50MB

const allowedImageExtensions = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".bmp",
  ".webp",
];
const allowedImageMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/bmp",
  "image/webp",
];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = uuidv4();
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  const isMp3 = ext === ".mp3" && mime === "audio/mpeg";
  const isImage =
    allowedImageExtensions.includes(ext) &&
    allowedImageMimeTypes.includes(mime);

  if (!isMp3 && !isImage) {
    return cb(new Error("Apenas arquivos MP3 ou imagens são permitidos."));
  }

  const fileSize = parseInt(req.headers["content-length"] || "0");

  if (isMp3 && fileSize > MAX_AUDIO_SIZE) {
    return cb(new Error("Arquivos MP3 devem ter no máximo 100MB."));
  }

  if (isImage && fileSize > MAX_IMAGE_SIZE) {
    return cb(new Error("Imagens devem ter no máximo 50MB."));
  }

  cb(null, true);
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});
