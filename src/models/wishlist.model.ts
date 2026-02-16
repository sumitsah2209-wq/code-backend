// user , product
import mongoose from "mongoose";

const wishlist_schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "User  is required"],
      ref: "user",
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: [true, "Product is required"],
    },
  },
  { timestamps: true },
);

// model
const Wishlist = mongoose.model("wishlist", wishlist_schema);
export default Wishlist;
