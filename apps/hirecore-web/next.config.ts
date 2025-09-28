import type { NextConfig } from "next";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";

const envPath = path.resolve(__dirname, "../../.env");
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

const nextConfig: NextConfig = {
  // env: {
  //   NEXT_PUBLIC_STORACHA_SPACE_DID: process.env.NEXT_PUBLIC_STORACHA_SPACE_DID,
  // },
};

export default nextConfig;
