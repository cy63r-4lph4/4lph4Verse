import type { NextConfig } from "next";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";

const envPath = path.resolve(__dirname, "../../.env");
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "pino",
    "thread-stream",
    "desm",
    "fastbench",
    "pino-elasticsearch",
    "tap",
    "tape",
    "why-is-node-running",
  ],
};
export default nextConfig;
