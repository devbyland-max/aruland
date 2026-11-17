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
  stitchBlue: "/products/stitch-blue.jpg",
  stitchPink: "/products/stitch-pink.jpg",
  breathingOtter: "/products/breathing-otter.jpg",
  breathingBunny: "/products/breathing-bunny.jpg",
  capybara: "/products/capybara.jpg",
  elephant: "/products/elephant.jpg",
};

const collections = [
  {
    name: "Stitch Friends",
    slug: "stitch-friends",
    tag: "Hot",
    imageUrl: IMG.stitchBlue,
  },
  {
    name: "Me Frymëmarrje",
    slug: "me-frymemarrje",
    tag: "E re",
    imageUrl: IMG.breathingOtter,
  },
  {
    name: "Kafshë të Buta",
    slug: "kafshe-te-buta",
    tag: "Popullore",
    imageUrl: IMG.capybara,
  },
];

const products = [
  {
    name: "Stitch Blu",
    slug: "stitch-blu",
    description:
      "Plush blu me veshë të mëdha — Stitch i butë për përqafime. Ideal për fansat e vegjël.",
    price: 3900,
    compareAtPrice: null as number | null,
    imageUrl: IMG.stitchBlue,
    category: "Stitch",
    color: "blue",
    sizeCm: 35,
    stock: 40,
    badges: ["hot", "new"] as string[],
    rating: 5,
  },
  {
    name: "Stitch Rozë (Angel)",
    slug: "stitch-roze-angel",
    description:
      "Version rozë i ëmbël me antenë. Shoqja ideale e Stitch Blu.",
    price: 3900,
    compareAtPrice: null,
    imageUrl: IMG.stitchPink,
    category: "Stitch",
    color: "pink",
    sizeCm: 35,
    stock: 35,
    badges: ["new"],
    rating: 4.9,
  },
  {
    name: "Vidër me Frymëmarrje",
    slug: "vider-me-frymemarrje",
    description:
      "Plush qetësues me efekt frymëmarrjeje — ndihmon fëmijët të flejnë më rehat.",
    price: 4500,
    compareAtPrice: 5200,
    imageUrl: IMG.breathingOtter,
    category: "Me Frymëmarrje",
    color: "beige",
    sizeCm: 30,
    stock: 25,
    badges: ["hot", "sale"],
    rating: 5,
  },
  {
    name: "Lepush me Frymëmarrje",
    slug: "lepush-me-frymemarrje",
    description:
      "Lepush pastel me frymëmarrje të butë. Perfekt për orën e gjumit.",
    price: 4300,
    compareAtPrice: null,
    imageUrl: IMG.breathingBunny,
    category: "Me Frymëmarrje",
    color: "cream",
    sizeCm: 28,
    stock: 28,
    badges: ["new"],
    rating: 4.9,
  },
  {
    name: "Capybara Cozy",
    slug: "capybara-cozy",
    description:
      "Capybara e rrumbullakët dhe ultra e butë. Karakteri më i qetë i dyqanit.",
    price: 3600,
    compareAtPrice: null,
    imageUrl: IMG.capybara,
    category: "Kafshë",
    color: "brown",
    sizeCm: 32,
    stock: 30,
    badges: ["hot"],
    rating: 4.9,
  },
  {
    name: "Elefanti Gri",
    slug: "elefanti-gri",
    description:
      "Elefant i butë me veshë të mëdha. Shoqërues i ngrohtë për përqafime.",
    price: 3400,
    compareAtPrice: null,
    imageUrl: IMG.elephant,
    category: "Kafshë",
    color: "gray",
    sizeCm: 35,
    stock: 32,
    badges: ["new"],
    rating: 4.8,
  },
  {
    name: "Arushi Kafe Klasik",
    slug: "arushi-kafe-klasik",
    description:
      "Arush i butë kafe, ideal për përqafime. Material premium dhe i sigurt për fëmijë.",
    price: 2900,
    compareAtPrice: null,
    imageUrl: IMG.brown,
    category: "Arusha",
    color: "brown",
    sizeCm: 35,
    stock: 40,
    badges: [],
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
    badges: [],
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
    `Seeded ${collections.length} collections and ${products.length} products.`
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
