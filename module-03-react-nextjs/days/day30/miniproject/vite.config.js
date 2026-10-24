import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";

// Tiny fake API so the menu can really be fetched PER CATEGORY:
//   GET /api/dishes?c=Breakfast          -> filtered dishes (after a short delay)
//   GET /api/dishes?c=All&fail=1         -> 500 error (to see the error state)
function fakeApi() {
  const handler = (req, res, next) => {
    if (!req.url.startsWith("/api/dishes")) return next();

    const url = new URL(req.url, "http://localhost");
    const category = url.searchParams.get("c") ?? "All";
    const dishes = JSON.parse(fs.readFileSync("server/dishes.json", "utf-8"));

    setTimeout(() => {
      res.setHeader("Content-Type", "application/json");
      if (url.searchParams.get("fail")) {
        res.statusCode = 500;
        return res.end(JSON.stringify({ message: "Server error" }));
      }
      res.end(
        JSON.stringify(
          category === "All" ? dishes : dishes.filter((d) => d.category === category)
        )
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
