import { cpSync, mkdirSync, rmSync } from "node:fs";
import { spawn } from "node:child_process";

const root = "pages-preview";
const dest = `${root}/Classic-Penguin-Bookshelf`;

rmSync(root, { recursive: true, force: true });
mkdirSync(dest, { recursive: true });
cpSync("out", dest, { recursive: true });

console.log(
  `Serving Pages-style tree at http://127.0.0.1:43123/Classic-Penguin-Bookshelf/`,
);

const child = spawn(
  "python3",
  ["-m", "http.server", "43123", "--bind", "127.0.0.1", "--directory", root],
  { stdio: "inherit" },
);

child.on("exit", (code) => process.exit(code ?? 0));
