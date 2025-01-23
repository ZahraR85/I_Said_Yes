import { Schema, model } from "mongoose";

const customerCateringSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the user who makes the selection
    selectedItems: [
      {
        category: {
          type: String,
          enum: [
            "Starter",
            "MainCourse",
            "Dessert",
            "ColdDrink",
            "CafeBar",
            "Fruits",
            "Cake",
            "Waiter",
          ],
          required: true,
        },
        items: [
          {
            cateringItemId: { type: Schema.Types.ObjectId, ref: "Catering", required: true }, // Reference to the catering item
            itemName: { type: String, required: true },
            quantity: { type: Number, required: true, default: 1 },
            price: { type: Number, required: true },
            description: { type: String, required: true },
          },
        ],
        categoryTotal: { type: Number, required: true, default: 0 },
      },
    ],
    grandTotal: { type: Number, required: true, default: 0 }, // Sum of all category totals
  },
  { timestamps: true }
);

export default model("CustomerCatering", customerCateringSchema);
