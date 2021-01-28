import { preseed } from "./preseed";
import { seed } from "./seed";

const mainSeeder = async () => {
  await preseed();
  console.info("🌵 Preseeding complete!");
  await seed();
  console.info("🌵 Seeding complete!");
};

mainSeeder();
