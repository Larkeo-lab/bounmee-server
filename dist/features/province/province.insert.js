"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../../config/prisma");
//npx ts-node -r tsconfig-paths/register src/features/province/province.insert.ts
async function main() {
    const provinces = [
        {
            code: "01",
            nameLo: "ນະ​ຄອນຫຼວງວຽງ​ຈັນ",
            nameEn: "Vientiane Capital",
            createdBy: "system",
        },
        {
            code: "02",
            nameLo: "ຜົ້ງສາລີ",
            nameEn: "Phongsaly",
            createdBy: "system",
        },
        {
            code: "03",
            nameLo: "ຫຼວງນ້ຳທາ",
            nameEn: "Luang Namtha",
            createdBy: "system",
        },
        {
            code: "04",
            nameLo: "ອຸດົມໄຊ",
            nameEn: "Oudomxay",
            createdBy: "system",
        },
        {
            code: "05",
            nameLo: "ບໍ່ແກ້ວ",
            nameEn: "Bokeo",
            createdBy: "system",
        },
        {
            code: "06",
            nameLo: "ຫຼວງພະບາງ",
            nameEn: "Luang Prabang",
            createdBy: "system",
        },
        {
            code: "07",
            nameLo: "ຫົວພັນ",
            nameEn: "Huaphanh",
            createdBy: "system",
        },
        {
            code: "08",
            nameLo: "ໄຊຍະບູລີ",
            nameEn: "Xayabury",
            createdBy: "system",
        },
        {
            code: "09",
            nameLo: "ຊຽງຂວາງ",
            nameEn: "Xieng Khouang",
            createdBy: "system",
        },
        {
            code: "10",
            nameLo: "ວຽງຈັນ",
            nameEn: "Vientiane",
            createdBy: "system",
        },
        {
            code: "11",
            nameLo: "ບໍລິຄຳໄຊ",
            nameEn: "Borikhamxay",
            createdBy: "system",
        },
        {
            code: "12",
            nameLo: "ຄຳມ່ວນ",
            nameEn: "Khammouane",
            createdBy: "system",
        },
        {
            code: "13",
            nameLo: "ສະຫວັນນະເຂດ",
            nameEn: "Savannakhet",
            createdBy: "system",
        },
        {
            code: "14",
            nameLo: "ສາລະວັນ",
            nameEn: "Saravan",
            createdBy: "system",
        },
        {
            code: "15",
            nameLo: "ເຊກອງ",
            nameEn: "Sekong",
            createdBy: "system",
        },
        {
            code: "16",
            nameLo: "ຈຳປາສັກ",
            nameEn: "Champasak",
            createdBy: "system",
        },
        {
            code: "17",
            nameLo: "ອັດຕະປື",
            nameEn: "Attapeu",
            createdBy: "system",
        },
        {
            code: "18",
            nameLo: "ໄຊສົມບູນ",
            nameEn: "Xaysomboun",
            createdBy: "system",
        },
    ];
    for (const province of provinces) {
        const result = await prisma_1.prisma.province.create({
            data: province,
        });
        console.log(`Inserted province: ${result.code} - ${result.nameEn}`);
    }
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma_1.prisma.$disconnect();
});
//npx ts-node src/features/province/province.insert.ts
