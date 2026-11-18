import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const IMG = {
  stitchBlue: "/products/stitch-blue.jpg",
  stitchPink: "/products/stitch-pink.jpg",
  breathingOtter: "/products/breathing-otter.jpg",
  breathingBunny: "/products/breathing-bunny.jpg",
  capybara: "/products/capybara.jpg",
  elephant: "/products/elephant.jpg",
  kafe: "/products/arushi-kafe.jpg",
  roze: "/products/arushi-roze.jpg",
  jumbo: "/products/arushi-jumbo.jpg",
  mini: "/products/arushi-mini.jpg",
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
    imageUrl: IMG.breathingBunny,
  },
  {
    name: "Arusha të buta",
    slug: "kafshe-te-buta",
    tag: "Popullore",
    imageUrl: IMG.elephant,
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
    stock: 3,
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
    imageUrl: IMG.kafe,
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
    imageUrl: IMG.roze,
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
    imageUrl: IMG.jumbo,
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
    imageUrl: IMG.mini,
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
