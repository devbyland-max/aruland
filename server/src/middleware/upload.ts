import multer from "multer";

function fileFilter(
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) {
  const ok = /image\/(jpeg|jpg|png|webp|gif)/i.test(file.mimetype);
  if (!ok) {
    cb(new Error("Lejohen vetëm foto (JPG, PNG, WEBP, GIF)"));
    return;
  }
  cb(null, true);
}

export const uploadProductImage = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single("image");
