import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { initRedis } from "val/core/redis";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

import express from "express";
import cors from "cors";
import { logger } from "val/utils/logger";
import { createRouter } from "val/core/router";
import { PinataSDK } from "pinata";


(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

await initRedis();
const app = express();
app.use(cors());
app.use(express.json());
app.use(createRouter());

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  logger.info(`🚀 VAL Gateway running on port ${PORT}`);
});
