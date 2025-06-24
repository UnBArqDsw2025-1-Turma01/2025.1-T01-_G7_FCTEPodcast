import express from "express";
import { configDotenv } from "dotenv";
import helmet from "helmet";
import cors from "cors";
import connect_db from "./config/connect_db";
import router from "./routes/router";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import Comentario from "./models/Comentario";
import { Usuario } from "./models/Usuario";
import Podcast from "./models/Podcast";
import Episodio from "./models/Episodio";
import path from "path";
configDotenv();

const app = express();
const API_PORT = process.env.API_PORT || 3008;
const CORS_ALLOWED_ORIGINS = process.env.CORS_ALLOWED_ORIGINS?.split(",");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Helmet para segurança
app.use(helmet({}));
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || CORS_ALLOWED_ORIGINS?.includes(origin)) {
        callback(null, true);
      } else {
        callback(
          new Error("Violação da política de CORS: Origem não permitida")
        );
      }
    },
    exposedHeaders: [
      "Content-Range",
      "Accept-Ranges",
      "Content-Length",
      "Content-Type",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
  })
);
app.use(cookieParser());
connect_db();

app.use("/api", router);

app.use("/api/files/images", express.static(path.resolve("uploads")));

Comentario.init(); // Inicializa o modelo Comentario
Usuario.init(); // Inicializa o modelo Usuario
Podcast.init(); // Inicializa o modelo Podcast
Episodio.init(); // Inicializa o modelo Episodio

console.log(mongoose.modelNames());

// isntanciacao do servidor
app.listen(API_PORT, () => {
  console.log(`API RODANDO NA PORTA: ${API_PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(
    `Link: ${
      process.env.API_HOST
        ? `${process.env.API_HOST}:${API_PORT}`
        : `http://localhost:${API_PORT}`
    }`
  );
  console.log(`Status: ${process.env.API_HOST}:${API_PORT}/status`);
});

export { app };
