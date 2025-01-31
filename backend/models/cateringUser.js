import { Schema, model } from "mongoose";

const SelectionCateringSchema = new Schema({
  CateringItemID: { type: Schema.Types.ObjectId, ref: "Catering", required: true },
  quantity: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  description: { type: String, required: true },
});

const cateringUserSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    selectedItems: [SelectionCateringSchema],
    grandTotal: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

export default model("CateringUser", cateringUserSchema);
