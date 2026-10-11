import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      index: true,
    },
    orderType: {
      type: String,
      enum: ["ready", "custom"],
      required: true,
    },
    customer: {
      name: { type: String, required: true, trim: true },
      email: { type: String, trim: true, lowercase: true },
      phone: { type: String, required: true, trim: true },
      whatsapp: { type: String, trim: true },
      address: { type: String, default: "" },
      city: { type: String, default: "" },
      postalCode: { type: String, default: "" },
      country: { type: String, default: "Pakistan" },
    },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: String,
        slug: String,
        image: String,
        size: String,
        color: String,
        qty: { type: Number, default: 1, min: 1 },
        price: Number,
        total: Number,
      },
    ],
    customDetails: {
      referenceImages: [String],
      description: String,
      measurements: {
        bust: String,
        waist: String,
        hip: String,
        length: String,
        shoulder: String,
        sleeve: String,
        armhole: String,
        neckDepth: String,
      },
      fabricChoice: String,
      colorPreference: String,
      eventDate: Date,
      budget: String,
      notes: String,
    },
    deliveryMethod: {
      type: String,
      enum: ["delivery", "pickup"],
      default: "delivery",
    },
    deliveryCharges: { type: Number, default: 0 },
    subtotal: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true, default: 0 },
    paymentMethod: {
      type: String,
      enum: ["stripe", "jazzcash", "easypaisa", "cod", "bank_transfer"],
      default: "cod",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "stitching",
        "ready",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
      index: true,
    },
    stripeSessionId: String,
    stripePaymentIntentId: String,
    adminNotes: { type: String, default: "" },
    statusHistory: [
      {
        status: String,
        note: String,
        changedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

orderSchema.pre("save", function (next) {
  if (!this.orderNumber) {
    const date = new Date();
    const y = date.getFullYear().toString().slice(-2);
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const rand = Math.floor(Math.random() * 9000) + 1000;
    this.orderNumber = `KC-${y}${m}-${rand}`;
  }
  next();
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
export { Order };