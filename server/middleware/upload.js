import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|gif/;
  const extOk = allowed.test(file.originalname.toLowerCase());
  const mimeOk = allowed.test(file.mimetype);

  if (extOk && mimeOk) return cb(null, true);
  cb(new Error("Only image files are allowed (jpeg, jpg, png, webp, gif)"));
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
    files: 8,
  },
  fileFilter,
});

export const uploadProduct = upload.array("images", 6);
export const uploadReferences = upload.array("references", 6);