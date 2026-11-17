import { Prisma } from "@prisma/client";
import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { serializeProduct } from "../lib/serialize.js";
import { AppError } from "../middleware/error.js";
import { validate } from "../middleware/validate.js";
import { productsQuerySchema } from "../validators/commerce.js";

const router = Router();

router.get("/", validate(productsQuerySchema), async (req, res, next) => {
  try {
    const {
      category,
      color,
      minPrice,
      maxPrice,
      minSize,
      maxSize,
      sort,
      q,
      page,
      limit,
    } = req.query as unknown as {
      category?: string;
      color?: string;
      minPrice?: number;
      maxPrice?: number;
      minSize?: number;
      maxSize?: number;
      sort: "popular" | "newest" | "price_asc" | "price_desc";
      q?: string;
      page: number;
      limit: number;
    };

    const where: Prisma.ProductWhereInput = {};
    if (category) where.category = category;
    if (color) where.color = color;
    if (minPrice != null || maxPrice != null) {
      where.price = {};
      if (minPrice != null) where.price.gte = minPrice;
      if (maxPrice != null) where.price.lte = maxPrice;
    }
    if (minSize != null || maxSize != null) {
      where.sizeCm = {};
      if (minSize != null) where.sizeCm.gte = minSize;
      if (maxSize != null) where.sizeCm.lte = maxSize;
    }
    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ];
    }

    const orderBy: Prisma.ProductOrderByWithRelationInput =
      sort === "newest"
        ? { createdAt: "desc" }
        : sort === "price_asc"
          ? { price: "asc" }
          : sort === "price_desc"
            ? { price: "desc" }
            : { rating: "desc" };

    const [total, items] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    res.json({
      items: items.map(serializeProduct),
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    });
  } catch (err) {
    next(err);
  }
});

router.get("/:slug", async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: req.params.slug },
    });
    if (!product) throw new AppError("Product not found", 404);
    res.json({ product: serializeProduct(product) });
  } catch (err) {
    next(err);
  }
});

export default router;
