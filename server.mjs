import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";

const port = Number(process.env.PORT || 4173);
const root = resolve("prototype");

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp"
};

function resolveRequestPath(url) {
  const cleanUrl = decodeURIComponent(url.split("?")[0]).replace(/^\/+/, "");
  const requestPath = cleanUrl || "index.html";
  const filePath = normalize(join(root, requestPath));

  if (!filePath.startsWith(root)) {
    return null;
  }

  if (existsSync(filePath) && statSync(filePath).isDirectory()) {
    return join(filePath, "index.html");
  }

  return filePath;
}

const server = createServer((req, res) => {
  const filePath = resolveRequestPath(req.url || "/");

  if (!filePath || !existsSync(filePath) || !statSync(filePath).isFile()) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Halaman tidak ditemukan.");
    return;
  }

  res.writeHead(200, {
    "Content-Type": types[extname(filePath)] || "application/octet-stream",
    "Cache-Control": "no-store"
  });
  createReadStream(filePath).pipe(res);
});

server.listen(port, () => {
  console.log(`RIMBAWAN BK prototype: http://localhost:${port}`);
});
