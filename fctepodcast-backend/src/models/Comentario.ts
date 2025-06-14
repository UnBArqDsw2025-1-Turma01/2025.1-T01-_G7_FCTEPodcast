import mongoose, { Schema } from "mongoose";

const ComentarioSchema = new Schema(
  {
    usuario: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    episodio: {
      type: Schema.Types.ObjectId,
      ref: "Episodio",
      required: true,
    },
    conteudo: {
      type: String,
      required: true,
      trim: true,
    },
    respostas: {
      type: [Schema.Types.ObjectId],
      ref: "Comentario",
      default: [],
    },
  },

  {
    collection: "comentarios",
    timestamps: true,
  }
);

const Comentario = mongoose.model("Comentario", ComentarioSchema);

export default Comentario;
