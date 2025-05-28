import mongoose, { Schema } from "mongoose";

const EpisodioSchema = new Schema(
  {
    titulo: {
      type: String,
      required: true,
      trim: true,
    },
    descricao: {
      type: String,
      required: true,
      trim: true,
    },
    audio_path: {
      type: String,
      required: true,
    },
    comentarios: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comentario",
        default: [],
      },
    ],
    comentarios_count: {
      type: Number,
      default: 0,
    },
    curtidas: [
      {
        type: Schema.Types.ObjectId,
        ref: "Usuario",
        default: [],
      },
    ],
    curtidas_count: {
      type: Number,
      default: 0,
    },
  },
  {
    collection: "episodios",
    timestamps: true,
  }
);

const Episodio = mongoose.model("Episodio", EpisodioSchema);

export default Episodio;
