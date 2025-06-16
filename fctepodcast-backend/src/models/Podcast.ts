import mongoose, { Schema } from "mongoose";

const PodcastSchema = new Schema(
  {
    titulo: {
      type: String,
      required: true,
      trim: true,
    },
    imagem_path: {
      type: String,
      default: "no_image_path",
    },
    descricao: {
      type: String,
      required: true,
      trim: true,
    },
    co_autores: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Professor",
        default: [],
      },
    ],
    autor: {
      type: mongoose.Types.ObjectId,
      ref: "Professor",
      required: true,
    },
    episodios: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Episodio",
        default: [],
      },
    ],
    tags: [
      {
        type: String,
        trim: true,
        required: true,
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
