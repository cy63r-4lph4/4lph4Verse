import express from "express";
import { relayRouter } from "../routes/relay";
import { authRouter } from "../routes/auth";
import { pinataRouter } from "../routes/pinata";

export function createRouter() {
  const router = express.Router();
  router.use("/v1/relay", relayRouter);
  router.use("/v1/auth", authRouter);
  router.use("/v1/pinata", pinataRouter);

  return router;
}
