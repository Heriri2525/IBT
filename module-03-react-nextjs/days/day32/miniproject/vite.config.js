import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";

// Tiny fake API so the menu can really be fetched PER CATEGORY:
//   GET /api/dishes?c=Breakfast          -> filtered dishes (after a short delay)
//   GET /api/dishes/doro-wat             -> one dish (404 if the slug is unknown)
//   add &fail=1 to any request           -> 500 error (to see the error state)
function fakeApi() {
  const handler = (req, res, next) => {
    if (!req.url.startsWith("/api/dishes")) return next();

    const url = new URL(req.url, "http://localhost");
    const dishes = JSON.parse(fs.readFileSync("server/dishes.json", "utf-8"));
    const send = (status, body) => {
      res.statusCode = status;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(body));
    };

    setTimeout(() => {
      if (url.searchParams.get("fail")) {
        return send(500, { message: "Server error" });
      }

      // GET /api/dishes/<slug>  -> one dish, or 404
      const match = url.pathname.match(/^\/api\/dishes\/([^/]+)$/);
      if (match) {
        const dish = dishes.find((d) => d.slug === decodeURIComponent(match[1]));
        return dish ? send(200, dish) : send(404, { message: "Not found" });
      }

      // GET /api/dishes?c=<category>
      const category = url.searchParams.get("c") ?? "All";
      send(
        200,
        category === "All" ? dishes : dishes.filter((d) => d.category === category)
      );
    }, 600); // delay so the loading state is visible
  };

  return {
    name: "fake-api",
    configureServer(server) {
      server.middlewares.use(handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler);
    },
  };
}

export default defineConfig({
  plugins: [react(), fakeApi()],
});
