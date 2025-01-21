const cateringSchema = new Schema(
  {
    userID: { type: Schema.Types.ObjectId, ref: "User", required: true },
    Starter: { price: { type: Number, default: 0 } },
    MainCourse: { price: { type: Number, default: 0 } },
    Dessert: { price: { type: Number, default: 0 } },
    ColdDrink: { price: { type: Number, default: 0 } },
    CafeBar: { price: { type: Number, default: 0 } },
    Fruits: { price: { type: Number, default: 0 } },
    Cake: { price: { type: Number, default: 0 } },
    Waiter: { price: { type: Number, default: 0 } },
    total: { type: Number, default: 0 },
  },
  { timestamps: true }
);
