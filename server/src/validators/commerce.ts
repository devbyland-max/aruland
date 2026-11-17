import { z } from "zod";

export const productsQuerySchema = z.object({
  query: z.object({
    category: z.string().optional(),
    color: z.string().optional(),
    minPrice: z.coerce.number().optional(),
    maxPrice: z.coerce.number().optional(),
    minSize: z.coerce.number().optional(),
    maxSize: z.coerce.number().optional(),
    sort: z
      .enum(["popular", "newest", "price_asc", "price_desc"])
      .optional()
      .default("popular"),
    q: z.string().optional(),
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(48).optional().default(12),
  }),
});

export const cartAddSchema = z.object({
  body: z.object({
    productId: z.string().min(1),
    qty: z.coerce.number().int().min(1).max(99).optional().default(1),
  }),
});

export const cartPatchSchema = z.object({
  body: z.object({
    productId: z.string().min(1),
    qty: z.coerce.number().int().min(0).max(99),
  }),
});

export const wishlistSchema = z.object({
  body: z.object({
    productId: z.string().min(1),
  }),
});

export const checkoutSchema = z.object({
  body: z.object({
    shippingName: z.string().min(2).max(100),
    shippingPhone: z.string().min(8).max(30),
    shippingEmail: z.union([z.literal(""), z.string().email()]).optional(),
    shippingLine1: z.string().min(3).max(120),
    shippingLine2: z.string().max(120).optional(),
    shippingCity: z.string().min(2).max(80),
    shippingState: z.string().max(80).optional(),
    shippingPostal: z.string().max(20).optional(),
    shippingCountry: z.string().min(2).max(2).optional().default("AL"),
  }),
});

export const productAdminSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(120),
    slug: z
      .string()
      .min(2)
      .max(140)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    description: z.string().min(10).max(2000),
    price: z.coerce.number().positive(),
    compareAtPrice: z.coerce.number().positive().nullable().optional(),
    imageUrl: z.string().url(),
    category: z.string().min(2).max(80),
    color: z.string().min(2).max(40),
    sizeCm: z.coerce.number().int().positive(),
    stock: z.coerce.number().int().min(0),
    badges: z.array(z.string()).optional().default([]),
    rating: z.coerce.number().min(0).max(5).optional().default(5),
  }),
});

export const orderStatusSchema = z.object({
  body: z.object({
    status: z.enum(["PENDING", "PAID", "FULFILLED", "CANCELLED", "REFUNDED"]),
  }),
});
