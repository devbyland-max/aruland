import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { money, serializeProduct } from "../lib/serialize.js";
import { AppError } from "../middleware/error.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  orderStatusSchema,
  productAdminSchema,
} from "../validators/commerce.js";

const router = Router();

router.use(requireAuth, requireAdmin);

router.get("/products", async (_req, res, next) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json({ products: products.map(serializeProduct) });
  } catch (err) {
    next(err);
  }
});

router.post("/products", validate(productAdminSchema), async (req, res, next) => {
  try {
    const product = await prisma.product.create({ data: req.body });
    res.status(201).json({ product: serializeProduct(product) });
  } catch (err) {
    next(err);
  }
});

router.put(
  "/products/:id",
  validate(productAdminSchema),
  async (req, res, next) => {
    try {
      const existing = await prisma.product.findUnique({
        where: { id: req.params.id },
      });
      if (!existing) throw new AppError("Product not found", 404);
      const product = await prisma.product.update({
        where: { id: req.params.id },
        data: req.body,
      });
      res.json({ product: serializeProduct(product) });
    } catch (err) {
      next(err);
    }
  }
);

router.delete("/products/:id", async (req, res, next) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

router.get("/orders", async (_req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      include: { items: true, user: { select: { id: true, email: true, name: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json({
      orders: orders.map((o) => ({
        ...o,
        subtotal: money(o.subtotal),
        shipping: money(o.shipping),
        total: money(o.total),
        items: o.items.map((i) => ({ ...i, price: money(i.price) })),
      })),
    });
  } catch (err) {
    next(err);
  }
});

router.patch(
  "/orders/:id/status",
  validate(orderStatusSchema),
  async (req, res, next) => {
    try {
      const order = await prisma.order.update({
        where: { id: req.params.id },
        data: { status: req.body.status },
        include: { items: true },
      });
      res.json({
        order: {
          ...order,
          subtotal: money(order.subtotal),
          shipping: money(order.shipping),
          total: money(order.total),
          items: order.items.map((i) => ({ ...i, price: money(i.price) })),
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
