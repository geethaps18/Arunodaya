import mongoose, { Schema } from "mongoose";

const MediaSchema = new Schema(
  {
    mediaType: String,
    url: String,
    publicId: String,
    fullPublicId: String,
    altText: String,
    folder: String,
  },
  { timestamps: true }
);

const Media =
  mongoose.models.Media || mongoose.model("Media", MediaSchema);

export default Media;