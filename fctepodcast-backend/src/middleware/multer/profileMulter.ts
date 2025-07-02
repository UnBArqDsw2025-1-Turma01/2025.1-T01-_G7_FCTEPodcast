import multer from "multer";
import path from "path";
import fs from "fs";

// Diretório de upload
const uploadDir = path.join(__dirname, "../../../uploads/profile-pictures");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/profile-pictures");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"];
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/bmp",
    "image/webp",
  ];

  if (!allowedExtensions.includes(ext) || !allowedMimeTypes.includes(mime)) {
    return cb(new Error("Apenas imagens são permitidas."));
  }

  cb(null, true);
};

export const uploadProfile = multer({
  storage,
  limits: { fileSize: 30 * 1024 * 1024 }, // 30MB em bytes
  fileFilter,
});
