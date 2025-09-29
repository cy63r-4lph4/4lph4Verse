// client.ts (server only)
import { create } from "@storacha/client";
import * as Proof from "@storacha/client/proof";

let clientPromise: ReturnType<typeof create> | null = null;

export async function getStorachaClient() {
  if (!clientPromise) {
    clientPromise = create();
  }

  const client = await clientPromise;

  const EMAIL = process.env.ADMIN_EMAIL;
  const SPACE_DID = process.env.STORACHA_SPACE_DID;
  const encoded = process.env.STORACHA_PROOFS_BASE64;

  if (!SPACE_DID) {
    throw new Error("❌ STORACHA_SPACE_DID is missing from .env");
  }
  if (!encoded) {
    throw new Error("❌ STORACHA_PROOFS_BASE64 is missing from .env");
  }

  // 1. Parse base64-encoded delegation into a Proof
const proof = await Proof.parse(encoded);

  // 2. Add/import the space into the client
  const space = await client.addSpace(proof);

  // 3. Set it as the current space
  await client.setCurrentSpace(space.did());

  // 4. Double-check
  const current = client.currentSpace();
  if (!current || current.did() !== SPACE_DID) {
    if (!EMAIL) {
      throw new Error("❌ ADMIN_EMAIL is missing from .env");
    }
    const account = await client.login(EMAIL as `${string}@${string}`);
    await account.plan.wait();
    await client.setCurrentSpace(SPACE_DID as `did:${string}:${string}`);
  }


  return client;
}
