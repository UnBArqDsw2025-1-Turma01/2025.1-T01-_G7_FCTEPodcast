import mongoose, { Schema } from "mongoose";

const NotificacaoSchema = new Schema({
  origem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  destino: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  tipo: {
    type: String,
    enum: ["comentario"],
    required: true,
  },
  episodio_referente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Episodio",
    required: false,
    default: null,
  },
  conteudo: {
    type: String,
    required: true,
  },
  lida: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Date,
    default: Date.now,
  },
});

export const Notificacao = mongoose.model("Notificacao", NotificacaoSchema);
