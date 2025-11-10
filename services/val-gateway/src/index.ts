
import express from "express";
import cors from "cors";
import { logger } from "val/utils/logger";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  logger.info(`🚀 VAL Gateway running on port ${PORT}`);

});