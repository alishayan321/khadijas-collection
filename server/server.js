import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import { connectDB } from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import orderRoutes from "./routes/orders.js";
import paymentRoutes from "./routes/payment.js";
import uploadRoutes from "./routes/upload.js";
import categoryRoutes from "./routes/categories.js";

dotenv.config();

const app = express();

/* ============ SECURITY ============ */
app.use(helmet());
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL,
      process.env.CLIENT_URL_PROD,
      "http://localhost:5173",
      "http://localhost:5174",
    ].filter(Boolean),
    credentials: true,
  })
);

/* ============ LOGGING ============ */
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

/* ============ RATE LIMITING ============ */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: { success: false, message: "Too many requests, please try later." },
});
app.use("/api", limiter);

/* ============ BODY PARSING ============ */
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

/* ============ ROUTES ============ */
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Khadija's Collection API ✅",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      products: "/api/products",
      orders: "/api/orders",
      categories: "/api/categories",
      payment: "/api/payment",
      upload: "/api/upload",
    },
  });
});

app.get("/api/health", (req, res) => {
  res.json({ success: true, status: "healthy", uptime: process.uptime() });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/upload", uploadRoutes);

/* ============ ERROR HANDLING ============ */
app.use(notFound);
app.use(errorHandler);

/* ============ START SERVER ============ */
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    // Auto-create default admin if none exists
    const Admin = (await import("./models/Admin.js")).default;
    const adminCount = await Admin.countDocuments();

    if (
      adminCount === 0 &&
      process.env.ADMIN_EMAIL &&
      process.env.ADMIN_PASSWORD
    ) {
      await Admin.create({
        name: "Khadija Admin",
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role: "superadmin",
      });
      console.log(`👤 Default admin created: ${process.env.ADMIN_EMAIL}`);
    }

    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on http://localhost:${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`📡 API Base: http://localhost:${PORT}/api\n`);
    });
  } catch (err) {
    console.error("❌ Failed to start:", err.message);
    process.exit(1);
  }
};

startServer();

process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err.message);
});