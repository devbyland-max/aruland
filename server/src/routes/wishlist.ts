import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { serializeProduct } from "../lib/serialize.js";
import { AppError } from "../middleware/error.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { wishlistSchema } from "../validators/commerce.js";

const router = Router();

router.use(requireAuth);

router.get("/", async (req, res, next) => {
  try {
    const items = await prisma.wishlistItem.findMany({
      where: { userId: req.user!.id },
      include: { product: true },
      orderBy: { createdAt: "desc" },
    });
    res.json({
      items: items.map((i) => ({
        id: i.id,
        productId: i.productId,
        product: serializeProduct(i.product),
      })),
    });
  } catch (err) {
    next(err);
  }
});

router.post("/", validate(wishlistSchema), async (req, res, next) => {
  try {
    const { productId } = req.body as { productId: string };
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new AppError("Product not found", 404);

    await prisma.wishlistItem.upsert({
      where: {
        userId_productId: { userId: req.user!.id, productId },
      },
      create: { userId: req.user!.id, productId },
      update: {},
    });

    const items = await prisma.wishlistItem.findMany({
      where: { userId: req.user!.id },
      include: { product: true },
      orderBy: { createdAt: "desc" },
    });

    res.status(201).json({
      items: items.map((i) => ({
        id: i.id,
        productId: i.productId,
        product: serializeProduct(i.product),
      })),
    });
  } catch (err) {
    next(err);
  }
});

router.delete("/:productId", async (req, res, next) => {
  try {
    await prisma.wishlistItem.deleteMany({
      where: { userId: req.user!.id, productId: req.params.productId },
    });
    const items = await prisma.wishlistItem.findMany({
      where: { userId: req.user!.id },
      include: { product: true },
      orderBy: { createdAt: "desc" },
    });
    res.json({
      items: items.map((i) => ({
        id: i.id,
        productId: i.productId,
        product: serializeProduct(i.product),
      })),
    });
  } catch (err) {
    next(err);
  }
});

export default router;
