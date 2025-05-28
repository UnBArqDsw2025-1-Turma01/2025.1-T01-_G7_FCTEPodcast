import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { Request } from "express";
import fs from "fs";

const uploadDir = path.join(__dirname, "../../../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 500MB em bytes
const MAX_FILE_SIZE = 500 * 1024 * 1024;

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
  const extension = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  const isMp3 = extension === ".mp3" || mime === "audio/mpeg";

  if (isMp3) {
    cb(null, true);
  } else {
    cb(new Error("Apenas arquivos MP3 são permitidos."));
  }
};

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  //   fileFilter: fileFilter,
});
