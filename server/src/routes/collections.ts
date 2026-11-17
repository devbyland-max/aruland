import { Router } from "express";
import { prisma } from "../lib/prisma.js";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const collections = await prisma.collection.findMany({
      orderBy: { name: "asc" },
    });
    res.json({ collections });
  } catch (err) {
    next(err);
  }
});

export default router;
