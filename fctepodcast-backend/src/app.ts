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
import { Notificacao } from "./models/Notificacao";
import { createServer } from "http";
import { Server } from "socket.io";
configDotenv();

const app = express();
const server = createServer(app);
const API_PORT = process.env.API_PORT || 3008;
const CORS_ALLOWED_ORIGINS = process.env.CORS_ALLOWED_ORIGINS?.split(",");

const io = new Server(server, {
  path: "/socket",
  cors: {
    origin: (origin, callback) => {
      if (!origin || CORS_ALLOWED_ORIGINS?.includes(origin)) {
        callback(null, true);
      } else {
        callback(
          new Error("Violação da política de CORS: Origem não permitida")
        );
      }
    },
    credentials: true,
  },
});

export const user_connections = new Map();

io.on("connection", (socket) => {
  console.log("Novo usuario conectado:", socket.id);

  socket.on("registar_usuario", async (user_id) => {
    if (!user_connections.has(user_id)) {
      // checa se o usuário já está registrado no banco
      const usuario = await Usuario.findById(user_id);
      if (!usuario) {
        console.error(`Usuário com ID ${user_id} não encontrado.`);
        return;
      }
      // Se não estiver, cria uma nova entrada no mapa
      console.log(`Registrando usuário ${user_id} no mapa de conexões.`);

      user_connections.set(user_id, []);
    }
    user_connections.get(user_id).push(socket.id);
    console.log(`Usuario ${user_id} registrado com socket ${socket.id}`);
  });

  socket.on("disconnect", () => {
    console.log("Usuario desconectado:", socket.id);

    for (const [user_id, sockets] of user_connections.entries()) {
      // Remove the socket ID from the user's connection list
      user_connections.set(
        user_id,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        sockets.filter((id: any) => id !== socket.id)
      );
      if (user_connections.get(user_id).length === 0) {
        user_connections.delete(user_id);
      }
    }
  });
});

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
Notificacao.init(); // Inicializa o modelo Notificacao

console.log(mongoose.modelNames());

// isntanciacao do servidor
server.listen(API_PORT, () => {
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
  console.log(
    `WebSocket: ${
      process.env.API_HOST
        ? `${process.env.API_HOST}:${API_PORT}/ws`
        : `http://localhost:${API_PORT}/ws`
    }`
  );
});

export { app, io };
