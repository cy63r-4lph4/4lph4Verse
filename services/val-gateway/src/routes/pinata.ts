import { pinata } from "@verse/sdk";
import express from "express";

export const pinataRouter = express.Router();

/**
 * @route POST /v1/pinata/upload
 * @desc Upload a file to Pinata and return CID + gateway URL
 */
pinataRouter.post("/upload", async (req, res) => {
  try {
    const file = (req as any).file;
    const { name = "metadata", type = "json" } = req.body;

    if (!file) {
      return res.status(400).json({ error: "Missing file" });
    }

    const webFile = new File([file.buffer], file.originalname, {
      type: file.mimetype,
      lastModified: Date.now(),
    });

    const { cid } = await pinata.upload.public.file(webFile);

    const url = await pinata.gateways.public.convert(cid);

    return res.status(200).json({
      cid,
      url: `${url}/${name}.${type}`,
    });
  } catch (error: any) {
    console.error("Pinata upload failed:", error);
    return res.status(500).json({
      error: error?.message || "Upload failed",
    });
  }
});
