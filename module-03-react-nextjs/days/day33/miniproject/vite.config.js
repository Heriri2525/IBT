import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import { normalizePhone, validate } from "./src/checkout/validate.js";

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

  // POST /api/orders — the server validates AGAIN (it has the final word)
  //   ?fail=1                  -> 500
  //   phone 0900000000         -> 422 "not registered with TeleBirr"
  const ordersHandler = (req, res, next) => {
    if (!req.url.startsWith("/api/orders") || req.method !== "POST") return next();

    const url = new URL(req.url, "http://localhost");
    let raw = "";
    req.on("data", (chunk) => (raw += chunk));
    req.on("end", () => {
      const send = (status, body) => {
        res.statusCode = status;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(body));
      };

      setTimeout(() => {
        if (url.searchParams.get("fail")) {
          return send(500, { message: "Server error" });
        }

        let order;
        try {
          order = JSON.parse(raw);
        } catch {
          return send(400, { message: "Bad JSON" });
        }

        const fieldErrors = validate({
          name: String(order.name ?? ""),
          phone: String(order.phone ?? ""),
          area: String(order.area ?? ""),
          notes: String(order.notes ?? ""),
        });
        if (!fieldErrors.phone && normalizePhone(order.phone).endsWith("900000000")) {
          fieldErrors.phone = "That number is not registered with TeleBirr";
        }
        if (Object.keys(fieldErrors).length > 0) {
          return send(422, { fieldErrors });
        }
        send(201, { id: Date.now().toString(36) });
      }, 800);
    });
  };

  return {
    name: "fake-api",
    configureServer(server) {
      server.middlewares.use(handler);
      server.middlewares.use(ordersHandler);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler);
      server.middlewares.use(ordersHandler);
    },
  };
}

export default defineConfig({
  plugins: [react(), fakeApi()],
});
