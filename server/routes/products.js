import express from "express";
import Product from "../models/Product.js";
import { protect } from "../middleware/auth.js";
import { uploadProduct } from "../middleware/upload.js";
import { uploadMany } from "../utils/cloudinary.js";

const router = express.Router();

/* ============ PUBLIC ============ */

// GET /api/products?category=abaya&subCategory=modern&gender=women&search=lehenga&featured=true&sort=newest
router.get("/", async (req, res, next) => {
  try {
    const {
      category,
      subCategory,
      gender,
      search,
      featured,
      sort,
    } = req.query;

    const filter = {};

    if (category && category !== "all") filter.category = category;
    if (subCategory && subCategory !== "all")
      filter.subCategory = subCategory;
    if (gender && gender !== "all") filter.gender = gender;
    if (featured === "true") filter.isFeatured = true;
    if (search) filter.name = { $regex: search, $options: "i" };

    let query = Product.find(filter);

    if (sort === "price_asc") query = query.sort({ price: 1 });
    else if (sort === "price_desc") query = query.sort({ price: -1 });
    else query = query.sort({ createdAt: -1 });

    const products = await query;
    res.json({ success: true, count: products.length, products });
  } catch (err) {
    next(err);
  }
});

// GET /api/products/:id
router.get("/:id", async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, product });
  } catch (err) {
    next(err);
  }
});

/* ============ ADMIN ============ */

// POST /api/products
router.post("/", protect, uploadProduct, async (req, res, next) => {
  try {
    // Parse existing images (if any)
    let existingImages = [];
    if (req.body.existingImages) {
      try {
        existingImages = JSON.parse(req.body.existingImages);
        if (!Array.isArray(existingImages)) existingImages = [];
      } catch {
        existingImages = [];
      }
    }

    // Upload new files
    let newUploadedUrls = [];
    if (req.files?.length) {
      newUploadedUrls = await uploadMany(
        req.files,
        "khadijas-collection/products"
      );
    }

    // Combine: existing first, then new
    let images = [...existingImages, ...newUploadedUrls];

    // Fallback: image URLs in body
    if (!images.length && req.body.imageUrls) {
      images = Array.isArray(req.body.imageUrls)
        ? req.body.imageUrls
        : [req.body.imageUrls];
    }

    const slug =
      req.body.slug ||
      req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") +
        "-" +
        Date.now().toString(36);

    // Remove existingImages field so it doesn't get saved
    const { existingImages: _, ...rest } = req.body;

    const product = await Product.create({
      ...rest,
      slug,
      images,
      price: Number(req.body.price),
      salePrice: req.body.salePrice ? Number(req.body.salePrice) : undefined,
      sizes: req.body.sizes
        ? typeof req.body.sizes === "string"
          ? JSON.parse(req.body.sizes)
          : req.body.sizes
        : ["S", "M", "L", "XL"],
      colors: req.body.colors
        ? typeof req.body.colors === "string"
          ? JSON.parse(req.body.colors)
          : req.body.colors
        : [],
      isFeatured:
        req.body.isFeatured === "true" || req.body.isFeatured === true,
      isCustomizable:
        req.body.isCustomizable === "true" ||
        req.body.isCustomizable === true,
      inStock: req.body.inStock === "true" || req.body.inStock === true,
    });

    res.status(201).json({ success: true, product });
  } catch (err) {
    next(err);
  }
});

// PUT /api/products/:id
router.put("/:id", protect, uploadProduct, async (req, res, next) => {
  try {
    const update = { ...req.body };

    // Numeric fields
    if (req.body.price) update.price = Number(req.body.price);
    if (req.body.salePrice) update.salePrice = Number(req.body.salePrice);

    // Arrays
    if (req.body.sizes) {
      update.sizes =
        typeof req.body.sizes === "string"
          ? JSON.parse(req.body.sizes)
          : req.body.sizes;
    }

    if (req.body.colors) {
      update.colors =
        typeof req.body.colors === "string"
          ? JSON.parse(req.body.colors)
          : req.body.colors;
    }

    // Existing images
    let existingImages = [];
    if (req.body.existingImages) {
      try {
        existingImages = JSON.parse(req.body.existingImages);
        if (!Array.isArray(existingImages)) existingImages = [];
      } catch {
        existingImages = [];
      }
    }

    // New uploaded files
    let newUploadedUrls = [];
    if (req.files?.length) {
      newUploadedUrls = await uploadMany(
        req.files,
        "khadijas-collection/products"
      );
    }

    // Combine: existing first (in order), then new
    update.images = [...existingImages, ...newUploadedUrls];

    // Clean up extra field
    delete update.existingImages;

    // Boolean conversions
    if (update.isFeatured !== undefined) {
      update.isFeatured =
        update.isFeatured === "true" || update.isFeatured === true;
    }
    if (update.isCustomizable !== undefined) {
      update.isCustomizable =
        update.isCustomizable === "true" || update.isCustomizable === true;
    }
    if (update.inStock !== undefined) {
      update.inStock = update.inStock === "true" || update.inStock === true;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, product });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/products/:id
router.delete("/:id", protect, async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, message: "Product deleted" });
  } catch (err) {
    next(err);
  }
});

export default router;