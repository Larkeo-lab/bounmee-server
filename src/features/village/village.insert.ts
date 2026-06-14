import { prisma } from "../../config/prisma";

// npx ts-node -r tsconfig-paths/register src/features/village/village.insert.ts
//
// ⚠️  ໝາຍເຫດ / NOTE:
// ນີ້ແມ່ນຂໍ້ມູນບ້ານ (village) ບາງສ່ວນຂອງນະຄອນຫຼວງວຽງຈັນ (provinceCode "01") ເທົ່ານັ້ນ.
// This is a PARTIAL seed of well-known villages in Vientiane Capital (provinceCode "01").
// districtCode ອ້າງອີງຕາມ district.insert.ts (01–09). ກະລຸນາກວດ/ເພີ່ມບ້ານທີ່ຍັງຂາດກ່ອນໃຊ້ຈິງ.
// Verify district assignments and add the remaining villages before production use.
//
// districtCode reference (province 01 = ນະຄອນຫຼວງວຽງຈັນ):
//   01 = ຈັນທະບູລີ Chanthabuly      06 = ໄຊທານີ Xaythany
//   02 = ສີໂຄດຕະບອງ Sikhottabong    07 = ຫາດຊາຍຟອງ Hadxaifong
//   03 = ໄຊເສດຖາ Xaysettha          08 = ສັງທອງ Sangthong
//   04 = ສີສັດຕະນາກ Sisattanak       09 = ປາກງື່ມ Pakngum
//   05 = ນາຊາຍທອງ Naxaithong

const villages = [
  // === ເມືອງ ຈັນທະບູລີ (Chanthabuly) — districtCode 01 ===
  { code: "01", districtCode: "01", provinceCode: "01", nameLo: "ຫັດສະດີ", nameEn: "Hatsady", createdBy: "system" },
  { code: "02", districtCode: "01", provinceCode: "01", nameLo: "ມີໄຊ", nameEn: "Mixay", createdBy: "system" },
  { code: "03", districtCode: "01", provinceCode: "01", nameLo: "ວັດຈັນ", nameEn: "Watchan", createdBy: "system" },
  { code: "04", districtCode: "01", provinceCode: "01", nameLo: "ຊຽງຍືນ", nameEn: "Xiengyeun", createdBy: "system" },
  { code: "05", districtCode: "01", provinceCode: "01", nameLo: "ຫາຍໂສກ", nameEn: "Haysok", createdBy: "system" },
  { code: "06", districtCode: "01", provinceCode: "01", nameLo: "ສີສະເກດ", nameEn: "Sisaket", createdBy: "system" },
  { code: "07", districtCode: "01", provinceCode: "01", nameLo: "ອານຸ", nameEn: "Anou", createdBy: "system" },
  { code: "08", districtCode: "01", provinceCode: "01", nameLo: "ໜອງຈັນ", nameEn: "Nongchan", createdBy: "system" },
  { code: "09", districtCode: "01", provinceCode: "01", nameLo: "ໂພນໄຊ", nameEn: "Phonexay", createdBy: "system" },
  { code: "10", districtCode: "01", provinceCode: "01", nameLo: "ສີບຸນເຮືອງ", nameEn: "Sibounheuang", createdBy: "system" },

  // === ເມືອງ ສີໂຄດຕະບອງ (Sikhottabong) — districtCode 02 ===
  { code: "01", districtCode: "02", provinceCode: "01", nameLo: "ສີໄຄ", nameEn: "Sikhai", createdBy: "system" },
  { code: "02", districtCode: "02", provinceCode: "01", nameLo: "ວັດໄຕທົ່ງ", nameEn: "Wattaythong", createdBy: "system" },
  { code: "03", districtCode: "02", provinceCode: "01", nameLo: "ວັດໄຕນ້ອຍ", nameEn: "Wattaynoy", createdBy: "system" },
  { code: "04", districtCode: "02", provinceCode: "01", nameLo: "ອາກາດ", nameEn: "Akat", createdBy: "system" },
  { code: "05", districtCode: "02", provinceCode: "01", nameLo: "ດົງນາໂຊກ", nameEn: "Dongnasok", createdBy: "system" },

  // === ເມືອງ ໄຊເສດຖາ (Xaysettha) — districtCode 03 ===
  { code: "01", districtCode: "03", provinceCode: "01", nameLo: "ໂພນປ່າເປົ້າ", nameEn: "Phonpapao", createdBy: "system" },
  { code: "02", districtCode: "03", provinceCode: "01", nameLo: "ໂພນທັນ", nameEn: "Phonthan", createdBy: "system" },
  { code: "03", districtCode: "03", provinceCode: "01", nameLo: "ໜອງບອນ", nameEn: "Nongbon", createdBy: "system" },
  { code: "04", districtCode: "03", provinceCode: "01", nameLo: "ຈີນາຍໂມ່", nameEn: "Chinaimo", createdBy: "system" },

  // === ເມືອງ ສີສັດຕະນາກ (Sisattanak) — districtCode 04 ===
  { code: "01", districtCode: "04", provinceCode: "01", nameLo: "ດົງປະຫລານ", nameEn: "Dongpalane", createdBy: "system" },
  { code: "02", districtCode: "04", provinceCode: "01", nameLo: "ສະພານທອງ", nameEn: "Saphanthong", createdBy: "system" },
  { code: "03", districtCode: "04", provinceCode: "01", nameLo: "ໂສກປ່າຫລວງ", nameEn: "Sokpaluang", createdBy: "system" },
  { code: "04", districtCode: "04", provinceCode: "01", nameLo: "ບຶງຂະຫຍອງ", nameEn: "Beungkhayong", createdBy: "system" },

  // === ເມືອງ ໄຊທານີ (Xaythany) — districtCode 06 ===
  { code: "01", districtCode: "06", provinceCode: "01", nameLo: "ດົງໂດກ", nameEn: "Dongdok", createdBy: "system" },
  { code: "02", districtCode: "06", provinceCode: "01", nameLo: "ທ່າງ່ອນ", nameEn: "Thangon", createdBy: "system" },

  // === ເມືອງ ຫາດຊາຍຟອງ (Hadxaifong) — districtCode 07 ===
  { code: "01", districtCode: "07", provinceCode: "01", nameLo: "ທ່າເດື່ອ", nameEn: "Thadeua", createdBy: "system" },

  // ⚠️ ບ້ານຂອງເມືອງ ນາຊາຍທອງ (05), ສັງທອງ (08), ປາກງື່ມ (09) ຍັງບໍ່ທັນເພີ່ມ — ກະລຸນາເພີ່ມຕື່ມ.
  // TODO: add villages for Naxaithong (05), Sangthong (08), Pakngum (09).
];

async function main() {
  // 1. Delete all existing villages
  console.log("🗑️  Deleting existing villages...");
  const deleted = await prisma.village.deleteMany();
  console.log(`🗑️  Deleted ${deleted.count} existing villages`);

  // 2. Load districts to validate that each village's district exists.
  //    District unique code = provinceCode + districtCode (e.g. "0101"), same as district.insert.ts.
  const districts = await prisma.district.findMany({
    select: { id: true, code: true },
  });
  const districtCodes = new Set(districts.map((d) => d.code));

  // 3. Map villages and validate their district code
  const villagesToInsert = villages
    .map((village) => {
      const districtUniqueCode = `${village.provinceCode}${village.districtCode}`;

      if (!districtCodes.has(districtUniqueCode)) {
        console.error(
          `❌ District code ${districtUniqueCode} not found for village ${village.nameEn} (${village.code})`,
        );
        return null;
      }

      // Village unique code = provinceCode + districtCode + villageCode (e.g. "010101")
      const uniqueCode = `${village.provinceCode}${village.districtCode}${village.code}`;

      return {
        code: uniqueCode,
        nameLo: village.nameLo,
        nameEn: village.nameEn,
        districtCode: districtUniqueCode,
        provinceCode: village.provinceCode,
        createdBy: village.createdBy,
      };
    })
    .filter((village) => village !== null);

  // 4. Insert all villages in one operation
  const result = await prisma.village.createMany({
    data: villagesToInsert,
    skipDuplicates: true,
  });

  console.log(`\n✅ Successfully inserted ${result.count} villages`);
  if (result.count < villagesToInsert.length) {
    console.log(
      `⚠️  ${villagesToInsert.length - result.count} villages were skipped (duplicates)`,
    );
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
// npx ts-node -r tsconfig-paths/register src/features/village/village.insert.ts
