import mongoose, { mongo, Schema } from "mongoose";

const PodcastSchema = new Schema(
  {
    titulo: {
      type: String,
      required: true,
      trim: true,
    },
    imagem_path: {
      type: String,
      required: true,
    },
    descricao: {
      type: String,
      required: true,
      trim: true,
    },
    autores: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Professor",
        required: true,
      },
    ],
    episodios: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Episodio",
        default: [],
      },
    ],
  },
  {
    collection: "podcasts",
    timestamps: true,
  }
);

const Podcast = mongoose.model("Podcast", PodcastSchema);

export default Podcast;
