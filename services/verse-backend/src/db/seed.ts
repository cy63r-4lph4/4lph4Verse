import "dotenv/config";

import { db } from ".";
import { arenaSchools } from "./schema";

async function seed() {
  const [knust] = await db
    .insert(arenaSchools)
    .values({
      name: "Kwame Nkrumah University of Science and Technology",
      slug: "knust",
      country: "Ghana",
    })
    .returning();


  console.log("Seed complete");
}

seed().then(() => process.exit(0));
