import express from "express";
import { relayRouter } from "../routes/relay";

export function createRouter() {
  const router = express.Router();
  router.use('/v1/relay', relayRouter);
  return router;
}