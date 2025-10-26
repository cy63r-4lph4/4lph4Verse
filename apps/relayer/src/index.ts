import "dotenv/config";
import express from "express";
import cors from "cors";
import { createWalletClient, http, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { celo } from "viem/chains";
import permitRoute from "./routes/permit"; // ✅ add this

const app = express();
app.use(cors());
app.use(express.json());

// Relayer wallet signer
const account = privateKeyToAccount(process.env.RELAYER_PRIVATE_KEY as `0x${string}`);

const client = createWalletClient({
  account,
  chain: celo,
  transport: http(process.env.RPC_URL)
});

app.get("/", (req, res) => {
  res.send({ status: "Relayer active", address: account.address });
});

app.post("/relay/ping", async (req, res) => {
  try {
    const tx = await client.sendTransaction({
      to: account.address,
      value: parseEther("0.0001")
    });

    res.send({ tx });
  } catch (err: any) {
    console.error(err);
    res.status(500).send({ error: err.message });
  }
});

// ✅ register the permit route
app.use("/relay/permit", permitRoute);

app.listen(process.env.PORT, () =>
  console.log(`Relayer running on port ${process.env.PORT}`)
);
