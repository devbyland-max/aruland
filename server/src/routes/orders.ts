import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { money } from "../lib/serialize.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

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
