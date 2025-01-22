import { Schema, model } from "mongoose";

const cateringSchema = new Schema(
  { 
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    category: {
      type: String,
      enum: ['Starter', 'MainCourse', 'Dessert', 'ColdDrink', 'CafeBar', 'Fruits', 'Cake', 'Waiter'],
      required: true,
    },
    ItemName: {
      type: String, // E.g., "name of food"
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    VariantDescription: {
      type: String,
      required: false,
    },
    imagePath: {
      type: String,
      required: true, // Path to the Cloudinary-hosted image
    },
  },
  { timestamps: true }
);

export default model("Catering", cateringSchema);