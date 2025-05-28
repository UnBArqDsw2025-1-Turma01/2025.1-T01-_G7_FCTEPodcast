import mongoose, { Schema } from "mongoose";

const TagSchema = new Schema(
  {
    nome: {
      type: String,
      required: true,
      trim: true,
    },
    codigo_fga: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: "tags",
  }
);

const Tag = mongoose.model("Tag", TagSchema);

export default Tag;
