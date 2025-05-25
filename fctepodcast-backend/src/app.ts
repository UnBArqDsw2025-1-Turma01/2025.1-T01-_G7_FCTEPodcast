import express from "express";
import { configDotenv } from "dotenv";
import helmet from "helmet";
import cors from "cors";
configDotenv();

const app = express();
const API_PORT = process.env.API_PORT || 3008;
const CORS_ALLOWED_ORIGINS = process.env.CORS_ALLOWED_ORIGINS?.split(",");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Helmet para segurança
app.use(helmet());
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
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
  })
);

// rota de statys
app.get("/status", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is running",
  });
});

// isntanciacao do servidor
app.listen(API_PORT, () => {
  console.log(`API RODANDO NA PORTA: ${API_PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(
    `Link: ${
      `${process.env.API_HOST}:${API_PORT}` || `http://localhost:${API_PORT}`
    }`
  );
  console.log(`Status: ${process.env.API_HOST}:${API_PORT}/status`);
});
