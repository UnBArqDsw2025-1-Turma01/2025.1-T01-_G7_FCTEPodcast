import express from "express";
import usuario_router from "./usuario_router/usuario_router";
import { ImageAdapter, ImageFileSystem } from "../adapter/ImageAdapter";

const router = express.Router();

// rota de status
router.get("/status", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is running",
  });
});

// const imageFileSystem = new ImageFileSystem("/app/uploads");
// const imageProvider = new ImageAdapter(imageFileSystem);

router.use("/usuario", usuario_router);

export default router;
