let cached;

function withApiPrefix(event) {
  const next = { ...event };
  const path = event.path || event.rawPath || "/";
  if (path.endsWith("/sitemap") || path.endsWith("/sitemap.xml")) {
    next.path = "/api/sitemap";
    if (next.rawPath) next.rawPath = "/api/sitemap";
    return next;
  }
  if (!path.startsWith("/api")) {
    const suffix = path === "/" ? "" : path;
    next.path = `/api${suffix}`;
    if (next.rawPath) next.rawPath = next.path;
  }
  return next;
}

exports.handler = async (event, context) => {
  if (!cached) {
    const { default: serverless } = await import("serverless-http");
    const { createApp } = await import("../../server/dist/app.js");
    cached = serverless(createApp(), {
      binary: ["image/*", "image/jpeg", "image/png", "image/webp", "image/gif"],
    });
  }
  return cached(withApiPrefix(event), context);
};
