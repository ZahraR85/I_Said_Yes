import { Schema, model } from 'mongoose';

const gallerySchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    imageName: { type: String, required: true },
    imagePath: { type: String, required: true }, // Updated to store file path
    description: { type: String,required: false, trim: true },
    category: {
      type: String,
      enum: ['Venue', 'Makeup', 'Photography', 'Wedding-dress', 'Musician', 'Cake', 'Designing'],
      required: true,
    },
  },
  { timestamps: true }
);

export default model('Gallery', gallerySchema);
