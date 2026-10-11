import express from "express";
import Category from "../models/Category.js";
import { protect } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { uploadBuffer } from "../utils/cloudinary.js";

const router = express.Router();

/* ============ PUBLIC ============ */

// GET /api/categories?gender=women
router.get("/", async (req, res, next) => {
  try {
    const { gender, active } = req.query;
    const filter = {};

    if (gender && gender !== "all") filter.gender = gender;
    if (active === "true") filter.isActive = true;

    const categories = await Category.find(filter).sort({
      order: 1,
      createdAt: 1,
    });

    res.json({ success: true, count: categories.length, categories });
  } catch (err) {
    next(err);
  }
});

// GET /api/categories/:id
router.get("/:id", async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }
    res.json({ success: true, category });
  } catch (err) {
    next(err);
  }
});

/* ============ ADMIN ============ */

// POST /api/categories
router.post("/", protect, upload.single("image"), async (req, res, next) => {
  try {
    let image = req.body.image || "";

    if (req.file) {
      const uploaded = await uploadBuffer(
        req.file.buffer,
        "khadijas-collection/categories"
      );
      image = uploaded.url;
    }

    const slug =
      req.body.slug ||
      req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    // Parse sub-categories
    let subCategories = [];
    if (req.body.subCategories) {
      try {
        const parsed =
          typeof req.body.subCategories === "string"
            ? JSON.parse(req.body.subCategories)
            : req.body.subCategories;
        subCategories = parsed
          .filter((s) => s.name && s.name.trim())
          .map((s) => ({
            name: s.name.trim(),
            slug: (
              s.slug || s.name
            )
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-"),
          }));
      } catch {
        subCategories = [];
      }
    }

    const category = await Category.create({
      ...req.body,
      slug,
      image,
      subCategories,
      order: req.body.order ? Number(req.body.order) : 0,
      isActive:
        req.body.isActive === "true" || req.body.isActive === true,
    });

    res.status(201).json({ success: true, category });
  } catch (err) {
    next(err);
  }
});

// PUT /api/categories/:id
router.put("/:id", protect, upload.single("image"), async (req, res, next) => {
  try {
    const update = { ...req.body };

    if (req.file) {
      const uploaded = await uploadBuffer(
        req.file.buffer,
        "khadijas-collection/categories"
      );
      update.image = uploaded.url;
    }

    if (update.order) update.order = Number(update.order);
    if (update.isActive !== undefined) {
      update.isActive = update.isActive === "true" || update.isActive === true;
    }

    // Parse sub-categories
    if (req.body.subCategories) {
      try {
        const parsed =
          typeof req.body.subCategories === "string"
            ? JSON.parse(req.body.subCategories)
            : req.body.subCategories;
        update.subCategories = parsed
          .filter((s) => s.name && s.name.trim())
          .map((s) => ({
            name: s.name.trim(),
            slug: (
              s.slug || s.name
            )
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-"),
          }));
      } catch {
        update.subCategories = [];
      }
    }

    const category = await Category.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    res.json({ success: true, category });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/categories/:id
router.delete("/:id", protect, async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }
    res.json({ success: true, message: "Category deleted" });
  } catch (err) {
    next(err);
  }
});

export default router;