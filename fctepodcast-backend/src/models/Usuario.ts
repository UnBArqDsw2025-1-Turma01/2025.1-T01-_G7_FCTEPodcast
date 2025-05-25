import mongoose, { Schema } from "mongoose";

const BaseUserSchema = new Schema(
  {
    nome: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    senha: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["ALUNO", "PROFESSOR"],
    },
    playlists: [
      {
        type: Schema.Types.ObjectId,
        ref: "Playlist",
        default: [],
      },
    ],
    curtidas: [
      {
        type: Schema.Types.ObjectId,
        ref: "Episodio",
        default: [],
      },
    ],
    podcasts_seg: [
      {
        type: Schema.Types.ObjectId,
        ref: "Podcast",
        default: [],
      },
    ],
    ativo: {
      type: Boolean,
      default: true,
    },
  },
  {
    collection: "usuarios",
    timestamps: true,
  }
);

const Usuario = mongoose.model("Usuario", BaseUserSchema);

const Aluno = Usuario.discriminator(
  "Aluno",
  new Schema({
    monitor_podcasts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Podcast",
        default: [],
      },
    ],
  })
);

const Professor = Usuario.discriminator(
  "Professor",
  new Schema({
    podcasts_criados: [
      {
        type: Schema.Types.ObjectId,
        ref: "Podcast",
        default: [],
      },
    ],
  })
);

export { Aluno, Professor };
