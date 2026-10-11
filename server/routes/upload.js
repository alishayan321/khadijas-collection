import express from "express";
import { protect } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { uploadBuffer } from "../utils/cloudinary.js";

const router = express.Router();

// POST /api/upload/single
router.post("/single", protect, upload.single("image"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }
    const result = await uploadBuffer(req.file.buffer, "khadijas-collection/misc");
    res.json({ success: true, url: result.url, publicId: result.publicId });
  } catch (err) {
    next(err);
  }
});

// POST /api/upload/multiple
router.post("/multiple", protect, upload.array("images", 6), async (req, res, next) => {
  try {
    if (!req.files?.length) {
      return res.status(400).json({ success: false, message: "No files" });
    }
    const urls = [];
    for (const f of req.files) {
      const r = await uploadBuffer(f.buffer, "khadijas-collection/misc");
      urls.push(r.url);
    }
    res.json({ success: true, urls });
  } catch (err) {
    next(err);
  }
});

export default router;