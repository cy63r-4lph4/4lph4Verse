import "dotenv/config";

import { db } from ".";
import { arenaSchools } from "./schema/arena_universities";
import { users } from "./schema/core/users";

async function seed() {
  const [knust] = await db
    .insert(arenaSchools)
    .values({
      name: "Kwame Nkrumah University of Science and Technology",
      slug: "knust",
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
