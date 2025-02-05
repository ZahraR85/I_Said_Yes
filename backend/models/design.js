import { Schema, model } from "mongoose";

const designSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    category: {
      type: String,
      required: true,
      trim: true,
      // Optional: restrict categories to a specific set of values.
      enum: [
        "Flowers",
        "Decoration",
        "Lighting",
        "Sound",
        "Fireworks",
      ],
    },
    designItemId: {
      type: String, unique: true,  default: function () { return this._id.toString(); } 
    },
    itemName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: true,
    },
    imagePath: {
      type: String,
      required: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model("Design", designSchema);
