import { Router, raw } from "express";
import Stripe from "stripe";
import { env } from "../config/env.js";
import { prisma } from "../lib/prisma.js";
import { stripe } from "../lib/stripe.js";
import { AppError } from "../middleware/error.js";

const router = Router();

router.post(
  "/",
  raw({ type: "application/json" }),
  async (req, res, next) => {
    try {
      if (!stripe || !env.STRIPE_WEBHOOK_SECRET) {
        throw new AppError("Stripe webhook not configured", 503);
      }

      const signature = req.headers["stripe-signature"];
      if (!signature || Array.isArray(signature)) {
        throw new AppError("Missing Stripe signature", 400);
      }

      let event: Stripe.Event;
      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          signature,
          env.STRIPE_WEBHOOK_SECRET
        );
      } catch {
        throw new AppError("Invalid Stripe signature", 400);
      }

      if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.orderId;
        if (orderId) {
          await prisma.$transaction(async (tx) => {
            const order = await tx.order.findUnique({
              where: { id: orderId },
              include: { items: true },
            });
            if (!order || order.status === "PAID") return;

            await tx.order.update({
              where: { id: orderId },
              data: {
                status: "PAID",
                stripeSessionId: session.id,
                stripePaymentIntentId:
                  typeof session.payment_intent === "string"
                    ? session.payment_intent
                    : session.payment_intent?.id,
              },
            });

            for (const item of order.items) {
              await tx.product.update({
                where: { id: item.productId },
                data: { stock: { decrement: item.qty } },
              });
            }

            if (order.userId) {
              await tx.cartItem.deleteMany({ where: { userId: order.userId } });
            }
          });
        }
      }

      res.json({ received: true });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
