import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { money } from "../lib/serialize.js";
import { cartOwnerWhere, ensureSession } from "../lib/session.js";
import { env } from "../config/env.js";
import { AppError } from "../middleware/error.js";
import { optionalAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { checkoutSchema } from "../validators/commerce.js";

const router = Router();

const ORDER_WHATSAPP =
  (process.env.ORDER_WHATSAPP_PHONE ?? "355689001257").replace(/\D/g, "");

function buildWhatsAppUrl(order: {
  id: string;
  shippingName: string | null;
  shippingPhone: string | null;
  shippingEmail: string | null;
  shippingLine1: string | null;
  shippingCity: string | null;
  shippingPostal: string | null;
  shippingCountry: string | null;
  total: number;
  shipping: number;
  items: { name: string; qty: number; price: number }[];
}) {
  const lines = [
    "Porosi e re - AruLand Toy Store",
    `Nr: ${order.id.slice(-8).toUpperCase()}`,
    "",
    `Klienti: ${order.shippingName ?? "-"}`,
    `Tel: ${order.shippingPhone ?? "-"}`,
    order.shippingEmail ? `Email: ${order.shippingEmail}` : null,
    `Adresa: ${order.shippingLine1 ?? "-"}, ${order.shippingCity ?? "-"}`,
    order.shippingPostal ? `Kodi postar: ${order.shippingPostal}` : null,
    `Shteti: ${order.shippingCountry ?? "AL"}`,
    "",
    "Produktet:",
    ...order.items.map(
      (i) => `- ${i.name} x${i.qty} = ${Math.round(i.price * i.qty)} ALL`
    ),
    "",
    `Transporti: ${order.shipping === 0 ? "Falas" : `${Math.round(order.shipping)} ALL`}`,
    `TOTALI: ${Math.round(order.total)} ALL`,
    "Pagesa: Në dorëzim (cash)",
  ].filter(Boolean);

  return `https://wa.me/${ORDER_WHATSAPP}?text=${encodeURIComponent(lines.join("\n"))}`;
}

router.post(
  "/",
  optionalAuth,
  ensureSession,
  validate(checkoutSchema),
  async (req, res, next) => {
    try {
      const shipping = req.body as {
        shippingName: string;
        shippingPhone: string;
        shippingEmail?: string;
        shippingLine1: string;
        shippingLine2?: string;
        shippingCity: string;
        shippingState?: string;
        shippingPostal?: string;
        shippingCountry?: string;
      };

      const cartItems = await prisma.cartItem.findMany({
        where: cartOwnerWhere(req),
        include: { product: true },
      });

      if (!cartItems.length) throw new AppError("Shporta është bosh", 400);

      for (const item of cartItems) {
        if (item.product.stock < item.qty) {
          throw new AppError(`Nuk ka stok për ${item.product.name}`, 400);
        }
      }

      const subtotal = cartItems.reduce(
        (sum, item) => sum + money(item.product.price) * item.qty,
        0
      );
      const freeShippingFrom = Number(process.env.FREE_SHIPPING_FROM ?? 5000);
      const shippingFeeFlat = Number(process.env.SHIPPING_FEE ?? 300);
      const shippingFee = subtotal >= freeShippingFrom ? 0 : shippingFeeFlat;
      const total = subtotal + shippingFee;

      const order = await prisma.$transaction(async (tx) => {
        const created = await tx.order.create({
          data: {
            userId: req.user?.id,
            status: "PENDING",
            paymentMethod: "COD",
            currency: "ALL",
            subtotal,
            shipping: shippingFee,
            total,
            shippingName: shipping.shippingName,
            shippingPhone: shipping.shippingPhone,
            shippingEmail: shipping.shippingEmail || null,
            shippingLine1: shipping.shippingLine1,
            shippingLine2: shipping.shippingLine2 || null,
            shippingCity: shipping.shippingCity,
            shippingState: shipping.shippingState || null,
            shippingPostal: shipping.shippingPostal || null,
            shippingCountry: shipping.shippingCountry || "AL",
            items: {
              create: cartItems.map((item) => ({
                productId: item.productId,
                name: item.product.name,
                price: item.product.price,
                qty: item.qty,
                imageUrl: item.product.imageUrl,
              })),
            },
          },
          include: { items: true },
        });

        for (const item of cartItems) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.qty } },
          });
        }

        await tx.cartItem.deleteMany({ where: cartOwnerWhere(req) });

        return created;
      });

      const payload = {
        id: order.id,
        shippingName: order.shippingName,
        shippingPhone: order.shippingPhone,
        shippingEmail: order.shippingEmail,
        shippingLine1: order.shippingLine1,
        shippingCity: order.shippingCity,
        shippingPostal: order.shippingPostal,
        shippingCountry: order.shippingCountry,
        total: money(order.total),
        shipping: money(order.shipping),
        items: order.items.map((i) => ({
          name: i.name,
          qty: i.qty,
          price: money(i.price),
        })),
      };

      const whatsappUrl = buildWhatsAppUrl(payload);

      res.status(201).json({
        orderId: order.id,
        whatsappUrl,
        shopPhone: `+${ORDER_WHATSAPP}`,
        message: "Porosia u regjistrua. Pagesa bëhet në dorëzim.",
        clientUrl: `${env.CLIENT_URL}/checkout/success?order_id=${order.id}`,
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
