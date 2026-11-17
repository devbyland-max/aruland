import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const IMG = {
  brown:
    "https://images.unsplash.com/photo-1530325553241-4f6e79230849?auto=format&fit=crop&w=800&q=80",
  pink:
    "https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=800&q=80",
  cream:
    "https://images.unsplash.com/photo-1562047276-404b62dd3105?auto=format&fit=crop&w=800&q=80",
  white:
    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80",
  cozy:
    "https://images.unsplash.com/photo-1584155828260-3271d8e6f8f0?auto=format&fit=crop&w=800&q=80",
  soft:
    "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80",
};

const collections = [
  {
    name: "Arusha Klasike",
    slug: "arusha-klasike",
    tag: "Popullore",
    imageUrl: IMG.brown,
  },
  {
    name: "Arusha Rozë",
    slug: "arusha-roze",
    tag: "E re",
    imageUrl: IMG.pink,
  },
  {
    name: "Arusha Jumbo",
    slug: "arusha-jumbo",
    tag: "Speciale",
    imageUrl: IMG.cream,
  },
];

const products = [
  {
    name: "Arushi Kafe Klasik",
    slug: "arushi-kafe-klasik",
    description:
      "Arush i butë kafe, ideal për përqafime. Material premium dhe i sigurt për fëmijë.",
    price: 2900,
    compareAtPrice: null as number | null,
    imageUrl: IMG.brown,
    category: "Arusha",
    color: "brown",
    sizeCm: 35,
    stock: 40,
    badges: [] as string[],
    rating: 4.9,
  },
  {
    name: "Arushi Rozë",
    slug: "arushi-roze",
    description:
      "Arush rozë i ëmbël — dhurata perfekte për ditëlindje dhe surpriza.",
    price: 2700,
    compareAtPrice: null,
    imageUrl: IMG.pink,
    category: "Arusha",
    color: "pink",
    sizeCm: 30,
    stock: 45,
    badges: ["new"],
    rating: 4.8,
  },
  {
    name: "Arushi Jumbo",
    slug: "arushi-jumbo",
    description:
      "Arush i madh (60cm) për përqafime të mëdha. Super i butë dhe cilësor.",
    price: 4900,
    compareAtPrice: 5500,
    imageUrl: IMG.cream,
    category: "Arusha",
    color: "cream",
    sizeCm: 60,
    stock: 20,
    badges: ["sale"],
    rating: 5,
  },
  {
    name: "Arushi i Bardhë",
    slug: "arushi-i-bardhe",
    description:
      "Arush i bardhë elegant me detaje të buta. Ideal për dhomën e fëmijëve.",
    price: 3100,
    compareAtPrice: null,
    imageUrl: IMG.white,
    category: "Arusha",
    color: "white",
    sizeCm: 40,
    stock: 30,
    badges: [],
    rating: 4.7,
  },
  {
    name: "Arushi Bezhë Cozy",
    slug: "arushi-bezhe-cozy",
    description:
      "Arush bezhë cozy për netët e ftohta. Teksturë ultra e butë.",
    price: 3300,
    compareAtPrice: null,
    imageUrl: IMG.cozy,
    category: "Arusha",
    color: "beige",
    sizeCm: 40,
    stock: 28,
    badges: ["hot"],
    rating: 4.9,
  },
  {
    name: "Arushi Mini",
    slug: "arushi-mini",
    description:
      "Arush i vogël për çantë ose dhuratë të shpejtë. I lehtë dhe i këndshëm.",
    price: 1900,
    compareAtPrice: null,
    imageUrl: IMG.soft,
    category: "Arusha",
    color: "brown",
    sizeCm: 20,
    stock: 60,
    badges: [],
    rating: 4.6,
  },
  {
    name: "Arushi me Zemër",
    slug: "arushi-me-zemer",
    description:
      "Arush romantik me detaje zemre — dhurata ideale për Valentine ose surpriza.",
    price: 3500,
    compareAtPrice: null,
    imageUrl: IMG.pink,
    category: "Arusha",
    color: "pink",
    sizeCm: 35,
    stock: 25,
    badges: ["new"],
    rating: 4.8,
  },
  {
    name: "Arushi Family Pack",
    slug: "arushi-family-pack",
    description:
      "Set me 2 arusha (mamaja + bebi). Ideal për dhurata familjare.",
    price: 5900,
    compareAtPrice: 6500,
    imageUrl: IMG.cream,
    category: "Arusha",
    color: "cream",
    sizeCm: 50,
    stock: 15,
    badges: ["sale"],
    rating: 5,
  },
];

async function main() {
  console.log("Seeding AruLand...");

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.collection.deleteMany();

  for (const c of collections) {
    await prisma.collection.create({ data: c });
  }

  for (const p of products) {
    await prisma.product.create({ data: p });
  }

  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@stitchbear.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "Admin123!";
  const adminName = process.env.ADMIN_NAME ?? "AruLand Admin";
  const rounds = Number(process.env.BCRYPT_ROUNDS ?? 12);

  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existing) {
    await prisma.user.create({
      data: {
        email: adminEmail,
        name: adminName,
        passwordHash: await bcrypt.hash(adminPassword, rounds),
        role: "ADMIN",
      },
    });
    console.log(`Admin created: ${adminEmail}`);
  } else {
    console.log(`Admin already exists: ${adminEmail}`);
  }

  console.log(
    `Seeded ${collections.length} collections and ${products.length} teddy bears.`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
