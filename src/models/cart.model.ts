import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "user is required"],
    },
    items: [
      {
        type: {
          product: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "product is required"],
            ref: "product",
          },
          quantity: {
            type: Number,
            default: 1,
          },
        },
      },
    ],
  },
  { timestamps: true },
);

const Cart = mongoose.model("cart", cartSchema);
export default Cart;
