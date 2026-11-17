import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { money } from "../lib/serialize.js";
import { AppError } from "../middleware/error.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/track/:code", async (req, res, next) => {
  try {
    const code = (req.params.code ?? "")
      .trim()
      .replace(/^#/, "")
      .replace(/[^a-zA-Z0-9]/g, "")
      .toUpperCase();
    if (code.length < 4 || code.length > 12) {
      throw new AppError("Kodi i porosise nuk është i vlefshëm", 400);
    }

    // Match the same public code shown in admin (#XXXXXXXX).
    const orders = await prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: "desc" },
      take: 300,
    });

    const order = orders.find(
      (o) => o.id.slice(-8).toUpperCase() === code || o.id.toUpperCase().endsWith(code)
    );
    if (!order) throw new AppError("Porosia nuk u gjet", 404);

    res.json({
      order: {
        id: order.id,
        code: order.id.slice(-8).toUpperCase(),
        status: order.status,
        total: money(order.total),
        createdAt: order.createdAt,
        shippingCity: order.shippingCity,
        items: order.items.map((i) => ({
          name: i.name,
          qty: i.qty,
        })),
      },
    });
  } catch (err) {
    next(err);
  }
});

router.use(requireAuth);

router.get("/", async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user!.id },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      orders: orders.map((o) => ({
        ...o,
        subtotal: money(o.subtotal),
        shipping: money(o.shipping),
        total: money(o.total),
        items: o.items.map((i) => ({
          ...i,
          price: money(i.price),
        })),
      })),
    });
  } catch (err) {
    next(err);
  }
});

export default router;
