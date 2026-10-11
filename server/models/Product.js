import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
    },
    salePrice: {
      type: Number,
      min: 0,
    },
    // ✅ Category — no enum, admin ki categories se aayegi
    category: {
      type: String,
      required: true,
      index: true,
      trim: true,
      lowercase: true,
    },
    // ✅ Sub-category — admin ki sub-categories se aayegi
    subCategory: {
      type: String,
      default: "",
      index: true,
      trim: true,
      lowercase: true,
    },
    gender: {
      type: String,
      enum: ["women", "men", "unisex"],
      default: "women",
      index: true,
    },
    images: {
      type: [String],
      default: [],
    },
    sizes: {
      type: [String],
      default: ["S", "M", "L", "XL"],
    },
    colors: {
      type: [String],
      default: [],
    },
    fabric: {
      type: String,
      default: "",
    },
    workDetails: {
      type: String,
      default: "",
    },
    inStock: {
      type: Boolean,
      default: true,
      index: true,
    },
    stockQuantity: {
      type: Number,
      default: 1,
      min: 0,
    },
    isCustomizable: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    tag: {
      type: String,
      default: "",
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Auto-generate slug
productSchema.pre("save", function (next) {
  if (this.isModified("name") && !this.slug) {
    this.slug =
      this.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") +
      "-" +
      Date.now().toString(36);
  }
  next();
});

const Product = mongoose.model("Product", productSchema);

export default Product;
export { Product };