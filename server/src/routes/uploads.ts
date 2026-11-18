import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../middleware/error.js";

const router = Router();

router.get("/:id", async (req, res, next) => {
  try {
    const image = await prisma.storedImage.findUnique({
      where: { id: req.params.id },
    });
    if (!image) {
      next(new AppError("Fotoja nuk u gjet", 404));
      return;
    }
    res.setHeader("Content-Type", image.mime);
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    res.send(Buffer.from(image.data));
  } catch (err) {
    next(err);
  }
});

export default router;
