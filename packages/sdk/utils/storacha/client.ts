// client.ts (server only)
import { create } from "@storacha/client";

let clientPromise: ReturnType<typeof create> | null = null;

export async function getStorachaClient() {
  if (!clientPromise) {
    clientPromise = create();
  }

  const client = await clientPromise;

  const EMAIL = process.env.ADMIN_EMAIL;
  const SPACE_DID = process.env.STORACHA_SPACE_DID;

  if (!SPACE_DID) {
    throw new Error("❌ STORACHA_SPACE_DID is missing from .env");
  }

  const current = client.currentSpace(); // <-- method call

  if (!current || current.did() !== SPACE_DID) {
    if (!EMAIL) {
      throw new Error("❌ ADMIN_EMAIL is missing from .env");
    }

    const account = await client.login(EMAIL as '`${string}@${string}`' );
    await account.plan.wait();

    await client.setCurrentSpace(SPACE_DID as `did:${string}:${string}`);
    console.log("✅ Using space:", SPACE_DID);
  }

  return client;
}
