import "dotenv/config";

import { db } from ".";
import { arenaSchools, arenaUsers } from "./schema";

async function seed() {
  const [knust] = await db
    .insert(arenaSchools)
    .values({
      name: "Kwame Nkrumah University of Science and Technology",
      shortName: "KNUST",
      country: "Ghana",
    })
    .returning();

//   await db.insert(arenaUsers).values({
//     username: "alpha",
//     email: "alpha@arena.test",
//     schoolId: knust.id,
//   });

  console.log("Seed complete");
}

seed().then(() => process.exit(0));
