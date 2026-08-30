"use strict";
/** Serves the built site. Static hosts (GitHub Pages, Netlify) don't need this;
    Railway and any plain Node host do. */
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const MIME = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png",
  ".jpg": "image/jpeg", ".webp": "image/webp", ".ico": "image/x-icon", ".json": "application/json" };

http.createServer((req, res) => {
  const url = decodeURIComponent((req.url || "/").split("?")[0]);
  const file = path.normalize(path.join(ROOT, url === "/" ? "/index.html" : url));
  if (!file.startsWith(ROOT)) { res.writeHead(403).end("Forbidden"); return; }
  fs.readFile(file, (err, buf) => {
    if (err) {
      fs.readFile(path.join(ROOT, "index.html"), (e2, home) => {
        if (e2) { res.writeHead(404).end("Not found"); return; }
        res.writeHead(404, { "Content-Type": MIME[".html"] }).end(home);
      });
      return;
    }
    res.writeHead(200, {
      "Content-Type": MIME[path.extname(file)] || "application/octet-stream",
      "Cache-Control": path.extname(file) === ".html" ? "no-cache" : "public, max-age=3600",
    });
    res.end(buf);
  });
}).listen(PORT, () => console.log("Coffeemia website on http://localhost:" + PORT));
