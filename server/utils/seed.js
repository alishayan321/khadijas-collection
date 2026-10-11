import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/Product.js";
import Admin from "../models/Admin.js";
import { connectDB } from "../config/db.js";

dotenv.config();

const sampleProducts = [
  {
    name: "Royal Bridal Lehenga",
    price: 99990,
    salePrice: 85990,
    category: "bridal",
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200",
    ],
    sizes: ["S", "M", "L", "XL", "Custom"],
    fabric: "Raw Silk with Zardozi Work",
    description:
      "An heirloom bridal lehenga with hand-embroidered zardozi, dabka and pearl work. Fully customizable.",
    isFeatured: true,
    tag: "Best Seller",
  },
  {
    name: "Ivory Walima Gown",
    price: 64990,
    salePrice: 54990,
    category: "bridal",
    images: [
      "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=1200",
    ],
    sizes: ["S", "M", "L", "XL"],
    fabric: "Organza with Crystal Work",
    description:
      "Flowing ivory walima gown with subtle crystal embellishments. Perfect for reception.",
    isFeatured: true,
    tag: "New",
  },
  {
    name: "Maroon Mehndi Sharara",
    price: 49990,
    salePrice: 42990,
    category: "eastern",
    images: [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1200",
    ],
    sizes: ["S", "M", "L", "XL"],
    fabric: "Chiffon with Gota Work",
    description:
      "Traditional mehndi sharara with vibrant maroon chiffon and gota kinari work.",
    isFeatured: true,
  },
  {
    name: "Golden Nikkah Ensemble",
    price: 79990,
    salePrice: 68990,
    category: "bridal",
    images: [
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=1200",
    ],
    sizes: ["S", "M", "L", "XL", "Custom"],
    fabric: "Tissue Silk with Gold Tilla",
    description:
      "Regal nikkah ensemble in golden tissue silk with intricate tilla embroidery.",
    isFeatured: true,
    tag: "Best Seller",
  },
];

const seed = async () => {
  try {
    await connectDB();
    console.log("🌱 Seeding...");

    await Product.deleteMany({});
    await Admin.deleteMany({});

    for (const p of sampleProducts) {
      const slug =
        p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") +
        "-" +
        Date.now().toString(36) +
        Math.random().toString(36).slice(2, 6);
      await Product.create({ ...p, slug });
    }

    await Admin.create({
      name: "Khadija Admin",
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
    });

    console.log("✅ Seed done");
    console.log(`📧 Admin: ${process.env.ADMIN_EMAIL}`);
    console.log(`🔑 Password: ${process.env.ADMIN_PASSWORD}`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err.message);
    process.exit(1);
  }
};

seed();