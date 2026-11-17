import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { money, serializeProduct } from "../lib/serialize.js";
import { cartOwnerWhere, ensureSession } from "../lib/session.js";
import { AppError } from "../middleware/error.js";
import { optionalAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { cartAddSchema, cartPatchSchema } from "../validators/commerce.js";

const router = Router();

router.use(optionalAuth, ensureSession);

async function loadCart(req: Parameters<typeof cartOwnerWhere>[0]) {
  const items = await prisma.cartItem.findMany({
    where: cartOwnerWhere(req),
    include: { product: true },
    orderBy: { createdAt: "asc" },
  });

  const mapped = items.map((item) => ({
    id: item.id,
    productId: item.productId,
    qty: item.qty,
    product: serializeProduct(item.product),
    lineTotal: money(item.product.price) * item.qty,
  }));

  const subtotal = mapped.reduce((sum, i) => sum + i.lineTotal, 0);
  const itemCount = mapped.reduce((sum, i) => sum + i.qty, 0);

  return { items: mapped, subtotal, itemCount };
}

router.get("/", async (req, res, next) => {
  try {
    res.json(await loadCart(req));
  } catch (err) {
    next(err);
  }
});

router.post("/", validate(cartAddSchema), async (req, res, next) => {
  try {
    const { productId, qty } = req.body as { productId: string; qty: number };
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new AppError("Product not found", 404);
    if (product.stock < 1) throw new AppError("Product is sold out", 400);

    const owner = cartOwnerWhere(req);
    const existing = await prisma.cartItem.findFirst({
      where: { ...owner, productId },
    });

    const nextQty = (existing?.qty ?? 0) + qty;
    if (nextQty > product.stock) {
      throw new AppError(`Only ${product.stock} in stock`, 400);
    }

    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { qty: nextQty },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          ...owner,
          productId,
          qty,
        },
      });
    }

    res.status(201).json(await loadCart(req));
  } catch (err) {
    next(err);
  }
});

router.patch("/", validate(cartPatchSchema), async (req, res, next) => {
  try {
    const { productId, qty } = req.body as { productId: string; qty: number };
    const owner = cartOwnerWhere(req);
    const existing = await prisma.cartItem.findFirst({
      where: { ...owner, productId },
    });
    if (!existing) throw new AppError("Cart item not found", 404);

    if (qty <= 0) {
      await prisma.cartItem.delete({ where: { id: existing.id } });
    } else {
      const product = await prisma.product.findUnique({ where: { id: productId } });
      if (!product) throw new AppError("Product not found", 404);
      if (qty > product.stock) {
        throw new AppError(`Only ${product.stock} in stock`, 400);
      }
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { qty },
      });
    }

    res.json(await loadCart(req));
  } catch (err) {
    next(err);
  }
});

router.delete("/", async (req, res, next) => {
  try {
    const productId = req.query.productId as string | undefined;
    const owner = cartOwnerWhere(req);
    if (productId) {
      await prisma.cartItem.deleteMany({ where: { ...owner, productId } });
    } else {
      await prisma.cartItem.deleteMany({ where: owner });
    }
    res.json(await loadCart(req));
  } catch (err) {
    next(err);
  }
});

export default router;
