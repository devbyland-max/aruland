import { Router } from "express";
import { prisma } from "../lib/prisma.js";

const SITE = "https://aruland.netlify.app";

const STATIC_PAGES = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/shop", priority: "0.9", changefreq: "daily" },
  { path: "/contact", priority: "0.6", changefreq: "monthly" },
  { path: "/track", priority: "0.5", changefreq: "monthly" },
  { path: "/policies", priority: "0.3", changefreq: "yearly" },
];

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const products = await prisma.product.findMany({
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    });

    const urls = [
      ...STATIC_PAGES.map((page) => ({
        loc: `${SITE}${page.path === "/" ? "/" : page.path}`,
        lastmod: new Date().toISOString().slice(0, 10),
        changefreq: page.changefreq,
        priority: page.priority,
      })),
      ...products.map((product) => ({
        loc: `${SITE}/product/${product.slug}`,
        lastmod: product.updatedAt.toISOString().slice(0, 10),
        changefreq: "weekly",
        priority: "0.8",
      })),
    ];

    const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${escapeXml(url.loc)}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

    res.type("application/xml").send(body);
  } catch (err) {
    next(err);
  }
});

export default router;
