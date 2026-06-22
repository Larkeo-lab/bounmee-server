import { readFileSync } from "node:fs";
import { join } from "node:path";

import { prisma } from "../../config/prisma";
import { createPoliceDistrictService } from "./police-district.service";
import { policeDistrictCreateSchema } from "./police-district.validate";

// npx ts-node -r tsconfig-paths/register src/features/police-district/police-district.insert.ts
//
// อ່ານ district-user.json (root ໂປຣເຈັກ) ແລ້ວສ້າງ ປກສ ເມືອງ + ບັນຊີຜູ້ໃຊ້ ທີລະອັນ.
// provinceCode / districtCode / villageCode ຈະຖືກ resolve ເປັນ id ໂດຍ service ເອງ.
// ⚠️ ຕ້ອງ seed province + district ກ່ອນ (province.insert.ts / district.insert.ts).

const FILE = join(__dirname, "../../../../district-user.json");

async function main() {
  const items = JSON.parse(readFileSync(FILE, "utf-8")) as unknown[];
  console.log(`📄 Loaded ${items.length} entries from district-user.json`);

  let created = 0;
  let failed = 0;

  for (const raw of items) {
    // Validate against the same schema the API uses
    const data = policeDistrictCreateSchema.parse(raw);
    try {
      await createPoliceDistrictService(data, data.createdBy || "system");
      created++;
      console.log(`✅ ${data.userName} → district ${data.districtCode}`);
    } catch (e: any) {
      failed++;
      console.error(`❌ ${data.userName}: ${e?.message || e}`);
    }
  }

  console.log(`\n✅ Done. created=${created}, failed=${failed}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
