import mongoose from "mongoose";

// name , description , category , brand , cover_image , images , price , is_featured , new_arrival , stock

const product_schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    // name:'hsgfj
    description: {
      type: String,
      minLength: [25, "Description is at least 25 char required"],
      required: [true, "Description uis required"],
    },
    // category:69807d0256a55e0fdfb5efd0
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Category is required"],
      ref: "category",
    },
    // brand:69807d0256a55e0fdfb5efd0
    // brand : {name:'MAC',logo:{},desc:''}
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "brand",
      required: [true, "Brand is required"],
    },
    price: {
      type: String,
      required: [true, "price is required"],
    },
    cover_image: {
      type: {
        path: {
          type: String,
          required: [true, "path is required"],
        },
        public_id: {
          type: String,
          required: [true, "public_id is required"],
        },
      },
      required: [true, "cover_image is required"],
    },
    images: [
      {
        type: {
          path: {
            type: String,
            required: [true, "path is required"],
          },
          public_id: {
            type: String,
            required: [true, "public_id is required"],
          },
        },
      },
    ],
    is_featured: {
      type: Boolean,
      default: false,
    },
    new_arrival: {
      type: Boolean,
      default: true,
    },
    stock: {
      type: Number,
      required: [true, "stock is required"],
    },
  },
  { timestamps: true },
);

//* product model
const Product = mongoose.model("product", product_schema);
export default Product;
