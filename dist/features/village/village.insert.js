"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../../config/prisma");
// npx ts-node -r tsconfig-paths/register src/features/village/village.insert.ts
//
// ⚠️  ໝາຍເຫດ / NOTE:
// ນີ້ແມ່ນຂໍ້ມູນບ້ານ (village) ຂອງນະຄອນຫຼວງວຽງຈັນ (provinceCode "01").
// This is a seed of villages in Vientiane Capital (provinceCode "01").
// districtCode ອ້າງອີງຕາມ district.insert.ts (01–09).
//
// districtCode reference (province 01 = ນະຄອນຫຼວງວຽງຈັນ):
//   01 = ຈັນທະບູລີ   02 = ສີໂຄດຕະບອງ   03 = ໄຊເສດຖາ   04 = ສີສັດຕະນາກ   05 = ນາຊາຍທອງ
//   06 = ໄຊທານີ      07 = ຫາດຊາຍຟອງ    08 = ສັງທອງ     09 = ປາກງື່ມ
//
// nameLo ໂດຍບໍ່ມີຄຳນຳໜ້າ "ບ້ານ" (ຕາມຮູບແບບເດີມ). nameEn = romanization.
const villages = [
    // === ເມືອງ ຈັນທະບູລີ (Chanthabuly) — districtCode 01 (37 ບ້ານ) ===
    { code: "01", districtCode: "01", provinceCode: "01", nameLo: "ໜອງເບື່ອງ", nameEn: "Nongbeuang", createdBy: "system" },
    { code: "02", districtCode: "01", provinceCode: "01", nameLo: "ບໍ່ນາວົວ", nameEn: "Bonavua", createdBy: "system" },
    { code: "03", districtCode: "01", provinceCode: "01", nameLo: "ຫ້ວຍຫົງ", nameEn: "Houayhong", createdBy: "system" },
    { code: "04", districtCode: "01", provinceCode: "01", nameLo: "ໂພນສະຫວ່າງ", nameEn: "Phonsavang", createdBy: "system" },
    { code: "05", districtCode: "01", provinceCode: "01", nameLo: "ໜອງທາເໜືອ", nameEn: "Nongtha Neua", createdBy: "system" },
    { code: "06", districtCode: "01", provinceCode: "01", nameLo: "ໜອງທາໃຕ້", nameEn: "Nongtha Tai", createdBy: "system" },
    { code: "07", districtCode: "01", provinceCode: "01", nameLo: "ດອນແດງ", nameEn: "Dondeng", createdBy: "system" },
    { code: "08", districtCode: "01", provinceCode: "01", nameLo: "ໂພນທອງສະຫວາດ", nameEn: "Phonthong Savath", createdBy: "system" },
    { code: "09", districtCode: "01", provinceCode: "01", nameLo: "ດົງປ່າແຫບ", nameEn: "Dongpaheb", createdBy: "system" },
    { code: "10", districtCode: "01", provinceCode: "01", nameLo: "ໂພນທອງຈອມມະນີ", nameEn: "Phonthong Chommani", createdBy: "system" },
    { code: "11", districtCode: "01", provinceCode: "01", nameLo: "ໂຮງແດງ", nameEn: "Hongdeng", createdBy: "system" },
    { code: "12", districtCode: "01", provinceCode: "01", nameLo: "ໂຮງໄກ່", nameEn: "Hongkai", createdBy: "system" },
    { code: "13", districtCode: "01", provinceCode: "01", nameLo: "ສະຫວ່າງ", nameEn: "Savang", createdBy: "system" },
    { code: "14", districtCode: "01", provinceCode: "01", nameLo: "ທົ່ງສ້າງນາງ", nameEn: "Thongsangnang", createdBy: "system" },
    { code: "15", districtCode: "01", provinceCode: "01", nameLo: "ໂຮງຄ່າເໜືອ", nameEn: "Hongkha Neua", createdBy: "system" },
    { code: "16", districtCode: "01", provinceCode: "01", nameLo: "ທົ່ງຕູມ", nameEn: "Thongtoum", createdBy: "system" },
    { code: "17", districtCode: "01", provinceCode: "01", nameLo: "ດົງມ່ຽງ", nameEn: "Dongmieng", createdBy: "system" },
    { code: "18", districtCode: "01", provinceCode: "01", nameLo: "ສີຄຳດອນ", nameEn: "Sikhamdon", createdBy: "system" },
    { code: "19", districtCode: "01", provinceCode: "01", nameLo: "ສີບຸນເຮືອງ", nameEn: "Sibounheuang", createdBy: "system" },
    { code: "20", districtCode: "01", provinceCode: "01", nameLo: "ໂຮງຄ່າໃຕ້", nameEn: "Hongkha Tai", createdBy: "system" },
    { code: "21", districtCode: "01", provinceCode: "01", nameLo: "ຄົວຫຼວງເໜືອ", nameEn: "Khoualuang Neua", createdBy: "system" },
    { code: "22", districtCode: "01", provinceCode: "01", nameLo: "ສີສະຫວາດເໜືອ", nameEn: "Sisavath Neua", createdBy: "system" },
    { code: "23", districtCode: "01", provinceCode: "01", nameLo: "ສີສະຫວາດກາງ", nameEn: "Sisavath Kang", createdBy: "system" },
    { code: "24", districtCode: "01", provinceCode: "01", nameLo: "ສີສະຫວາດໃຕ້", nameEn: "Sisavath Tai", createdBy: "system" },
    { code: "25", districtCode: "01", provinceCode: "01", nameLo: "ທົ່ງຄັນຄຳເໜືອ", nameEn: "Thongkhankham Neua", createdBy: "system" },
    { code: "26", districtCode: "01", provinceCode: "01", nameLo: "ທົ່ງຄັນຄຳໃຕ້", nameEn: "Thongkhankham Tai", createdBy: "system" },
    { code: "27", districtCode: "01", provinceCode: "01", nameLo: "ຄົວຫຼວງໃຕ້", nameEn: "Khoualuang Tai", createdBy: "system" },
    { code: "28", districtCode: "01", provinceCode: "01", nameLo: "ສີຫອມ", nameEn: "Sihom", createdBy: "system" },
    { code: "29", districtCode: "01", provinceCode: "01", nameLo: "ອະນຸ", nameEn: "Anou", createdBy: "system" },
    { code: "30", districtCode: "01", provinceCode: "01", nameLo: "ສາຍລົມ", nameEn: "Sailom", createdBy: "system" },
    { code: "31", districtCode: "01", provinceCode: "01", nameLo: "ຫັດສະດີເໜືອ", nameEn: "Hatsadi Neua", createdBy: "system" },
    { code: "32", districtCode: "01", provinceCode: "01", nameLo: "ຫັດສະດີໃຕ້", nameEn: "Hatsadi Tai", createdBy: "system" },
    { code: "33", districtCode: "01", provinceCode: "01", nameLo: "ຊຽງຍືນ", nameEn: "Xiengyeun", createdBy: "system" },
    { code: "34", districtCode: "01", provinceCode: "01", nameLo: "ຫາຍໂສກ", nameEn: "Haysok", createdBy: "system" },
    { code: "35", districtCode: "01", provinceCode: "01", nameLo: "ວັດຈັນ", nameEn: "Watchan", createdBy: "system" },
    { code: "36", districtCode: "01", provinceCode: "01", nameLo: "ມີໄຊ", nameEn: "Mixay", createdBy: "system" },
    { code: "37", districtCode: "01", provinceCode: "01", nameLo: "ຊຽງຍືມ", nameEn: "Xiengyeum", createdBy: "system" },
    // === ເມືອງ ສີໂຄດຕະບອງ (Sikhottabong) — districtCode 02 (54 ບ້ານ) ===
    { code: "01", districtCode: "02", provinceCode: "01", nameLo: "ນາຄຳ", nameEn: "Nakham", createdBy: "system" },
    { code: "02", districtCode: "02", provinceCode: "01", nameLo: "ອູບມຸງ", nameEn: "Oubmoung", createdBy: "system" },
    { code: "03", districtCode: "02", provinceCode: "01", nameLo: "ໜອງປາໄນ", nameEn: "Nongpanai", createdBy: "system" },
    { code: "04", districtCode: "02", provinceCode: "01", nameLo: "ວັດໄຕນ້ອຍທ່າ", nameEn: "Wattaynoy Tha", createdBy: "system" },
    { code: "05", districtCode: "02", provinceCode: "01", nameLo: "ວັດໄຕນ້ອຍທົ່ງ", nameEn: "Wattaynoy Thong", createdBy: "system" },
    { code: "06", districtCode: "02", provinceCode: "01", nameLo: "ໜອງສະໂນຄຳ", nameEn: "Nongsanokham", createdBy: "system" },
    { code: "07", districtCode: "02", provinceCode: "01", nameLo: "ວັດໄຕໃຫຍ່ທ່າ", nameEn: "Wattayyai Tha", createdBy: "system" },
    { code: "08", districtCode: "02", provinceCode: "01", nameLo: "ອາກາດ", nameEn: "Akat", createdBy: "system" },
    { code: "09", districtCode: "02", provinceCode: "01", nameLo: "ເມືອງວາທົ່ງ", nameEn: "Meuangva Thong", createdBy: "system" },
    { code: "10", districtCode: "02", provinceCode: "01", nameLo: "ສີໄກທ່າ", nameEn: "Sikhai Tha", createdBy: "system" },
    { code: "11", districtCode: "02", provinceCode: "01", nameLo: "ສີໄກທົ່ງໃຕ້", nameEn: "Sikhai Thong Tai", createdBy: "system" },
    { code: "12", districtCode: "02", provinceCode: "01", nameLo: "ສີໄກທົ່ງເໜືອ", nameEn: "Sikhai Thong Neua", createdBy: "system" },
    { code: "13", districtCode: "02", provinceCode: "01", nameLo: "ຢາຜາ", nameEn: "Yapha", createdBy: "system" },
    { code: "14", districtCode: "02", provinceCode: "01", nameLo: "ສີບຸນເຮືອງທ່າ", nameEn: "Sibounheuang Tha", createdBy: "system" },
    { code: "15", districtCode: "02", provinceCode: "01", nameLo: "ສີບຸນເຮືອງທົ່ງ", nameEn: "Sibounheuang Thong", createdBy: "system" },
    { code: "16", districtCode: "02", provinceCode: "01", nameLo: "ສີຊົມຊື່ນ", nameEn: "Sixomxeun", createdBy: "system" },
    { code: "17", districtCode: "02", provinceCode: "01", nameLo: "ໂນນສະຫວ່າງ", nameEn: "Nonsavang", createdBy: "system" },
    { code: "18", districtCode: "02", provinceCode: "01", nameLo: "ອ່າວເຫຼົ່າ", nameEn: "Aolao", createdBy: "system" },
    { code: "19", districtCode: "02", provinceCode: "01", nameLo: "ດ່ານຄຳ", nameEn: "Dankham", createdBy: "system" },
    { code: "20", districtCode: "02", provinceCode: "01", nameLo: "ໂນນຂີ້ເຫັກ", nameEn: "Nonkhihek", createdBy: "system" },
    { code: "21", districtCode: "02", provinceCode: "01", nameLo: "ໂນນແກ້ວ", nameEn: "Nonkeo", createdBy: "system" },
    { code: "22", districtCode: "02", provinceCode: "01", nameLo: "ໂພນສະຫວັດເໜືອ", nameEn: "Phonsavath Neua", createdBy: "system" },
    { code: "23", districtCode: "02", provinceCode: "01", nameLo: "ໂພນສົມບູນ", nameEn: "Phonsomboun", createdBy: "system" },
    { code: "24", districtCode: "02", provinceCode: "01", nameLo: "ທາດທອງ", nameEn: "Thatthong", createdBy: "system" },
    { code: "25", districtCode: "02", provinceCode: "01", nameLo: "ໜອງດາ", nameEn: "Nongda", createdBy: "system" },
    { code: "26", districtCode: "02", provinceCode: "01", nameLo: "ໃໝ່", nameEn: "Mai", createdBy: "system" },
    { code: "27", districtCode: "02", provinceCode: "01", nameLo: "ຫ້ວຍຫອມ", nameEn: "Houayhom", createdBy: "system" },
    { code: "28", districtCode: "02", provinceCode: "01", nameLo: "ອ່າງ", nameEn: "Ang", createdBy: "system" },
    { code: "29", districtCode: "02", provinceCode: "01", nameLo: "ໂພສີ", nameEn: "Phosy", createdBy: "system" },
    { code: "30", districtCode: "02", provinceCode: "01", nameLo: "ນາແຮ່", nameEn: "Nahe", createdBy: "system" },
    { code: "31", districtCode: "02", provinceCode: "01", nameLo: "ວຽງສະຫວັນ", nameEn: "Viengsavanh", createdBy: "system" },
    { code: "32", districtCode: "02", provinceCode: "01", nameLo: "ທົ່ງປົ່ງ", nameEn: "Thongpong", createdBy: "system" },
    { code: "33", districtCode: "02", provinceCode: "01", nameLo: "ນາລາວ", nameEn: "Nalao", createdBy: "system" },
    { code: "34", districtCode: "02", provinceCode: "01", nameLo: "ໜອງງ້ຽວ", nameEn: "Nongngiew", createdBy: "system" },
    { code: "35", districtCode: "02", provinceCode: "01", nameLo: "ໜອງແຕ່ງໃຕ້", nameEn: "Nongteng Tai", createdBy: "system" },
    { code: "36", districtCode: "02", provinceCode: "01", nameLo: "ໜອງແຕ່ງເໜືອ", nameEn: "Nongteng Neua", createdBy: "system" },
    { code: "37", districtCode: "02", provinceCode: "01", nameLo: "ປາກທ່າງ", nameEn: "Pakthang", createdBy: "system" },
    { code: "38", districtCode: "02", provinceCode: "01", nameLo: "ດົງນາທອງ", nameEn: "Dongnathong", createdBy: "system" },
    { code: "39", districtCode: "02", provinceCode: "01", nameLo: "ຫຼັກຫີນ", nameEn: "Lakhin", createdBy: "system" },
    { code: "40", districtCode: "02", provinceCode: "01", nameLo: "ໜອງເບືອກໃຕ້", nameEn: "Nongbeuak Tai", createdBy: "system" },
    { code: "41", districtCode: "02", provinceCode: "01", nameLo: "ໜອງເບືອກເໜືອ", nameEn: "Nongbeuak Neua", createdBy: "system" },
    { code: "42", districtCode: "02", provinceCode: "01", nameLo: "ດ່າງອກລາວ", nameEn: "Dangoklao", createdBy: "system" },
    { code: "43", districtCode: "02", provinceCode: "01", nameLo: "ຈຳເຂດ", nameEn: "Chamkhet", createdBy: "system" },
    { code: "44", districtCode: "02", provinceCode: "01", nameLo: "ຄຸນຕາທົ່ງ", nameEn: "Khounta Thong", createdBy: "system" },
    { code: "45", districtCode: "02", provinceCode: "01", nameLo: "ຄຸນຕາທ່າ", nameEn: "Khounta Tha", createdBy: "system" },
    { code: "46", districtCode: "02", provinceCode: "01", nameLo: "ສີຖານເໜືອ", nameEn: "Sithan Neua", createdBy: "system" },
    { code: "47", districtCode: "02", provinceCode: "01", nameLo: "ໜອງດ້ວງເໜືອ", nameEn: "Nongduang Neua", createdBy: "system" },
    { code: "48", districtCode: "02", provinceCode: "01", nameLo: "ໜອງດ້ວງໃຕ້", nameEn: "Nongduang Tai", createdBy: "system" },
    { code: "49", districtCode: "02", provinceCode: "01", nameLo: "ໜອງດ້ວງທົ່ງ", nameEn: "Nongduang Thong", createdBy: "system" },
    { code: "50", districtCode: "02", provinceCode: "01", nameLo: "ໂພນສະຫວັດໃຕ້", nameEn: "Phonsavath Tai", createdBy: "system" },
    { code: "51", districtCode: "02", provinceCode: "01", nameLo: "ໜອງບົວທອງເໜືອ", nameEn: "Nongbouathong Neua", createdBy: "system" },
    { code: "52", districtCode: "02", provinceCode: "01", nameLo: "ໂພນຄຳ", nameEn: "Phonkham", createdBy: "system" },
    { code: "53", districtCode: "02", provinceCode: "01", nameLo: "ຈັນສະຫວ່າງ", nameEn: "Chansavang", createdBy: "system" },
    { code: "54", districtCode: "02", provinceCode: "01", nameLo: "ດອນຈິງຈູ", nameEn: "Donchingchou", createdBy: "system" },
    // === ເມືອງ ໄຊເສດຖາ (Xaysettha) — districtCode 03 (52 ບ້ານ) ===
    { code: "01", districtCode: "03", provinceCode: "01", nameLo: "ຈອມມະນີເໜືອ", nameEn: "Chommani Neua", createdBy: "system" },
    { code: "02", districtCode: "03", provinceCode: "01", nameLo: "ຈອມມະນີກາງ", nameEn: "Chommani Kang", createdBy: "system" },
    { code: "03", districtCode: "03", provinceCode: "01", nameLo: "ຈອມມະນີໃຕ້", nameEn: "Chommani Tai", createdBy: "system" },
    { code: "04", districtCode: "03", provinceCode: "01", nameLo: "ໂພນພະເນົາ", nameEn: "Phonphenao", createdBy: "system" },
    { code: "05", districtCode: "03", provinceCode: "01", nameLo: "ໂພນຂັນ", nameEn: "Phonkhan", createdBy: "system" },
    { code: "06", districtCode: "03", provinceCode: "01", nameLo: "ໜອງຊາງ", nameEn: "Nongxang", createdBy: "system" },
    { code: "07", districtCode: "03", provinceCode: "01", nameLo: "ໂພນສະອາດ", nameEn: "Phonsaath", createdBy: "system" },
    { code: "08", districtCode: "03", provinceCode: "01", nameLo: "ທາດເໜືອ", nameEn: "That Neua", createdBy: "system" },
    { code: "09", districtCode: "03", provinceCode: "01", nameLo: "ໜອງບອນ", nameEn: "Nongbon", createdBy: "system" },
    { code: "10", districtCode: "03", provinceCode: "01", nameLo: "ໂພນໄຊ", nameEn: "Phonxay", createdBy: "system" },
    { code: "11", districtCode: "03", provinceCode: "01", nameLo: "ນາຊາຍ", nameEn: "Naxay", createdBy: "system" },
    { code: "12", districtCode: "03", provinceCode: "01", nameLo: "ໄຜ່", nameEn: "Phai", createdBy: "system" },
    { code: "13", districtCode: "03", provinceCode: "01", nameLo: "ມົງຈະເລີນ", nameEn: "Mongchaleun", createdBy: "system" },
    { code: "14", districtCode: "03", provinceCode: "01", nameLo: "ທາດກາງ", nameEn: "That Kang", createdBy: "system" },
    { code: "15", districtCode: "03", provinceCode: "01", nameLo: "ທາດໃຕ້", nameEn: "That Tai", createdBy: "system" },
    { code: "16", districtCode: "03", provinceCode: "01", nameLo: "ທົ່ງແຄ", nameEn: "Thongkhe", createdBy: "system" },
    { code: "17", districtCode: "03", provinceCode: "01", nameLo: "ສີສັງອອນ", nameEn: "Sisangon", createdBy: "system" },
    { code: "18", districtCode: "03", provinceCode: "01", nameLo: "ສະພັງໝໍ້", nameEn: "Saphangmor", createdBy: "system" },
    { code: "19", districtCode: "03", provinceCode: "01", nameLo: "ໂພນທັບເໜືອ", nameEn: "Phonthap Neua", createdBy: "system" },
    { code: "20", districtCode: "03", provinceCode: "01", nameLo: "ໂພນທັບໃຕ້", nameEn: "Phonthap Tai", createdBy: "system" },
    { code: "21", districtCode: "03", provinceCode: "01", nameLo: "ຮ່ອງສຸພາບ", nameEn: "Hongsouphap", createdBy: "system" },
    { code: "22", districtCode: "03", provinceCode: "01", nameLo: "ໂນນສະຫວ່າງ", nameEn: "Nonsavang", createdBy: "system" },
    { code: "23", districtCode: "03", provinceCode: "01", nameLo: "ຮ່ອງເໜືອ", nameEn: "Hong Neua", createdBy: "system" },
    { code: "24", districtCode: "03", provinceCode: "01", nameLo: "ໂນນສ້າງດາ", nameEn: "Nonsangda", createdBy: "system" },
    { code: "25", districtCode: "03", provinceCode: "01", nameLo: "ອາມອນ", nameEn: "Amon", createdBy: "system" },
    { code: "26", districtCode: "03", provinceCode: "01", nameLo: "ແສງສະຫວ່າງ", nameEn: "Sengsavang", createdBy: "system" },
    { code: "27", districtCode: "03", provinceCode: "01", nameLo: "ໂຄດຄຳ", nameEn: "Khotkham", createdBy: "system" },
    { code: "28", districtCode: "03", provinceCode: "01", nameLo: "ວັງຄາຍ", nameEn: "Vangkhay", createdBy: "system" },
    { code: "29", districtCode: "03", provinceCode: "01", nameLo: "ໂນນສະຫວ່າງ (2)", nameEn: "Nonsavang 2", createdBy: "system" },
    { code: "30", districtCode: "03", provinceCode: "01", nameLo: "ຫົວຂົວ", nameEn: "Houakhoua", createdBy: "system" },
    { code: "31", districtCode: "03", provinceCode: "01", nameLo: "ໂນນທັນເໜືອ", nameEn: "Nonthan Neua", createdBy: "system" },
    { code: "32", districtCode: "03", provinceCode: "01", nameLo: "ຄຳສະຫວັດ", nameEn: "Khamsavath", createdBy: "system" },
    { code: "33", districtCode: "03", provinceCode: "01", nameLo: "ໂນນຫວາຍ", nameEn: "Nonvai", createdBy: "system" },
    { code: "34", districtCode: "03", provinceCode: "01", nameLo: "ເມືອງນ້ອຍ", nameEn: "Meuangnoy", createdBy: "system" },
    { code: "35", districtCode: "03", provinceCode: "01", nameLo: "ສອງລະດາ", nameEn: "Songlada", createdBy: "system" },
    { code: "36", districtCode: "03", provinceCode: "01", nameLo: "ຄຳງອຍ", nameEn: "Khamngoy", createdBy: "system" },
    { code: "37", districtCode: "03", provinceCode: "01", nameLo: "ມາສັງຜ່າຍ", nameEn: "Masangphay", createdBy: "system" },
    { code: "38", districtCode: "03", provinceCode: "01", nameLo: "ສົມສະຫງ່າ", nameEn: "Somsanga", createdBy: "system" },
    { code: "39", districtCode: "03", provinceCode: "01", nameLo: "ໄທດຳ", nameEn: "Thaidam", createdBy: "system" },
    { code: "40", districtCode: "03", provinceCode: "01", nameLo: "ໝາກອາຍກາງ", nameEn: "Makay Kang", createdBy: "system" },
    { code: "41", districtCode: "03", provinceCode: "01", nameLo: "ໝາກອາຍໃຕ້", nameEn: "Makay Tai", createdBy: "system" },
    { code: "42", districtCode: "03", provinceCode: "01", nameLo: "ໂສກນ້ອຍ", nameEn: "Soknoy", createdBy: "system" },
    { code: "43", districtCode: "03", provinceCode: "01", nameLo: "ໂສກໃຫຍ່", nameEn: "Sokyai", createdBy: "system" },
    { code: "44", districtCode: "03", provinceCode: "01", nameLo: "ຊຳແຄ", nameEn: "Xamkhe", createdBy: "system" },
    { code: "45", districtCode: "03", provinceCode: "01", nameLo: "ໂພນທອງ", nameEn: "Phonthong", createdBy: "system" },
    { code: "46", districtCode: "03", provinceCode: "01", nameLo: "ໝາບຮົມ", nameEn: "Mabhom", createdBy: "system" },
    { code: "47", districtCode: "03", provinceCode: "01", nameLo: "ດົງໃຫຍ່", nameEn: "Dongyai", createdBy: "system" },
    { code: "48", districtCode: "03", provinceCode: "01", nameLo: "ດົງກາງ", nameEn: "Dongkang", createdBy: "system" },
    { code: "49", districtCode: "03", provinceCode: "01", nameLo: "ນາໄຮ", nameEn: "Nahai", createdBy: "system" },
    { code: "50", districtCode: "03", provinceCode: "01", nameLo: "ນາໂນ", nameEn: "Nano", createdBy: "system" },
    { code: "51", districtCode: "03", provinceCode: "01", nameLo: "ຈອມສີ", nameEn: "Chomsy", createdBy: "system" },
    { code: "52", districtCode: "03", provinceCode: "01", nameLo: "ໂນນທັນໃຕ້", nameEn: "Nonthan Tai", createdBy: "system" },
    // === ເມືອງ ສີສັດຕະນາກ (Sisattanak) — districtCode 04 (37 ບ້ານ) ===
    { code: "01", districtCode: "04", provinceCode: "01", nameLo: "ເພຍວັດ", nameEn: "Phiawat", createdBy: "system" },
    { code: "02", districtCode: "04", provinceCode: "01", nameLo: "ເກົ້າຍອດ", nameEn: "Kaoyod", createdBy: "system" },
    { code: "03", districtCode: "04", provinceCode: "01", nameLo: "ສີເມືອງ", nameEn: "Simeuang", createdBy: "system" },
    { code: "04", districtCode: "04", provinceCode: "01", nameLo: "ດົງປ່າລານທ່າ", nameEn: "Dongpalan Tha", createdBy: "system" },
    { code: "05", districtCode: "04", provinceCode: "01", nameLo: "ດົງປ່າລານທົ່ງ", nameEn: "Dongpalan Thong", createdBy: "system" },
    { code: "06", districtCode: "04", provinceCode: "01", nameLo: "ໜອງຈັນ", nameEn: "Nongchan", createdBy: "system" },
    { code: "07", districtCode: "04", provinceCode: "01", nameLo: "ໂພນສີນວນ", nameEn: "Phonsinouan", createdBy: "system" },
    { code: "08", districtCode: "04", provinceCode: "01", nameLo: "ທາດຂາວ", nameEn: "Thatkhao", createdBy: "system" },
    { code: "09", districtCode: "04", provinceCode: "01", nameLo: "ພະໄຊ", nameEn: "Phaxay", createdBy: "system" },
    { code: "10", districtCode: "04", provinceCode: "01", nameLo: "ຜາໂພ", nameEn: "Phapho", createdBy: "system" },
    { code: "11", districtCode: "04", provinceCode: "01", nameLo: "ບຶງຂະຫຍອງ", nameEn: "Beungkhayong", createdBy: "system" },
    { code: "12", districtCode: "04", provinceCode: "01", nameLo: "ໂສກປ່າຫຼວງ", nameEn: "Sokpaluang", createdBy: "system" },
    { code: "13", districtCode: "04", provinceCode: "01", nameLo: "ໂພນສະຫວັນເໜືອ", nameEn: "Phonsavanh Neua", createdBy: "system" },
    { code: "14", districtCode: "04", provinceCode: "01", nameLo: "ໂພນສະຫວັນໃຕ້", nameEn: "Phonsavanh Tai", createdBy: "system" },
    { code: "15", districtCode: "04", provinceCode: "01", nameLo: "ວັດນາກ", nameEn: "Watnak", createdBy: "system" },
    { code: "16", districtCode: "04", provinceCode: "01", nameLo: "ທົ່ງກາງ", nameEn: "Thongkang", createdBy: "system" },
    { code: "17", districtCode: "04", provinceCode: "01", nameLo: "ທ່າພະລານໄຊ", nameEn: "Thaphalanxay", createdBy: "system" },
    { code: "18", districtCode: "04", provinceCode: "01", nameLo: "ດອນປ່າໄມ້", nameEn: "Donpamai", createdBy: "system" },
    { code: "19", districtCode: "04", provinceCode: "01", nameLo: "ທົ່ງພັນທອງ", nameEn: "Thongphanthong", createdBy: "system" },
    { code: "20", districtCode: "04", provinceCode: "01", nameLo: "ສະພານທອງເໜືອ", nameEn: "Saphanthong Neua", createdBy: "system" },
    { code: "21", districtCode: "04", provinceCode: "01", nameLo: "ສະພານທອງໃຕ້", nameEn: "Saphanthong Tai", createdBy: "system" },
    { code: "22", districtCode: "04", provinceCode: "01", nameLo: "ດອນນົກຂຸ້ມ", nameEn: "Donnokkhoum", createdBy: "system" },
    { code: "23", districtCode: "04", provinceCode: "01", nameLo: "ໂພນປ່າເປົ້າ", nameEn: "Phonpapao", createdBy: "system" },
    { code: "24", districtCode: "04", provinceCode: "01", nameLo: "ດອນກອຍ", nameEn: "Donkoy", createdBy: "system" },
    { code: "25", districtCode: "04", provinceCode: "01", nameLo: "ດົງສະຫວາດ", nameEn: "Dongsavath", createdBy: "system" },
    { code: "26", districtCode: "04", provinceCode: "01", nameLo: "ໂພໄຊ", nameEn: "Phoxay", createdBy: "system" },
    { code: "27", districtCode: "04", provinceCode: "01", nameLo: "ສ້າງຫ້ວຍ", nameEn: "Sanghouay", createdBy: "system" },
    { code: "28", districtCode: "04", provinceCode: "01", nameLo: "ພັນໝັ້ນ", nameEn: "Phanman", createdBy: "system" },
    { code: "29", districtCode: "04", provinceCode: "01", nameLo: "ວັດສີບ", nameEn: "Watsib", createdBy: "system" },
    { code: "30", districtCode: "04", provinceCode: "01", nameLo: "ສວນມອນ", nameEn: "Suanmon", createdBy: "system" },
    { code: "31", districtCode: "04", provinceCode: "01", nameLo: "ຫາຍໂສກ", nameEn: "Haysok", createdBy: "system" },
    { code: "32", districtCode: "04", provinceCode: "01", nameLo: "ໂຄກນິນ", nameEn: "Khoknin", createdBy: "system" },
    { code: "33", districtCode: "04", provinceCode: "01", nameLo: "ໂພນສະຫວ່າງ", nameEn: "Phonsavang", createdBy: "system" },
    { code: "34", districtCode: "04", provinceCode: "01", nameLo: "ໄຊສະຖານ", nameEn: "Xaysathan", createdBy: "system" },
    { code: "35", districtCode: "04", provinceCode: "01", nameLo: "ຈອມແຈ້ງ", nameEn: "Chomcheng", createdBy: "system" },
    { code: "36", districtCode: "04", provinceCode: "01", nameLo: "ຈອມເພັດເໜືອ", nameEn: "Chomphet Neua", createdBy: "system" },
    { code: "37", districtCode: "04", provinceCode: "01", nameLo: "ຈອມເພັດໃຕ້", nameEn: "Chomphet Tai", createdBy: "system" },
    // === ເມືອງ ນາຊາຍທອງ (Naxaithong) — districtCode 05 ===
    { code: "01", districtCode: "05", provinceCode: "01", nameLo: "ນາຊາຍທອງ", nameEn: "Naxaithong", createdBy: "system" },
    { code: "02", districtCode: "05", provinceCode: "01", nameLo: "ນາຄູນນ້ອຍ", nameEn: "Nakounnoy", createdBy: "system" },
    { code: "03", districtCode: "05", provinceCode: "01", nameLo: "ນາຄູນໃຫຍ່", nameEn: "Nakounyai", createdBy: "system" },
    { code: "04", districtCode: "05", provinceCode: "01", nameLo: "ໜອງຄ້າ", nameEn: "Nongkha", createdBy: "system" },
    { code: "05", districtCode: "05", provinceCode: "01", nameLo: "ໂພນງາມ", nameEn: "Phongam", createdBy: "system" },
    { code: "06", districtCode: "05", provinceCode: "01", nameLo: "ດົງໂດກ", nameEn: "Dongdok", createdBy: "system" },
    { code: "07", districtCode: "05", provinceCode: "01", nameLo: "ນາຄຳ", nameEn: "Nakham", createdBy: "system" },
    { code: "08", districtCode: "05", provinceCode: "01", nameLo: "ໜອງບົວ", nameEn: "Nongboua", createdBy: "system" },
    { code: "09", districtCode: "05", provinceCode: "01", nameLo: "ໂພນທັນ", nameEn: "Phonthan", createdBy: "system" },
    { code: "10", districtCode: "05", provinceCode: "01", nameLo: "ປາກຊາບ", nameEn: "Pakxap", createdBy: "system" },
    // === ເມືອງ ໄຊທານີ (Xaythany) — districtCode 06 ===
    { code: "01", districtCode: "06", provinceCode: "01", nameLo: "ໂນນຄໍ້", nameEn: "Nonkhor", createdBy: "system" },
    { code: "02", districtCode: "06", provinceCode: "01", nameLo: "ຄຳສະຫວາດ", nameEn: "Khamsavath", createdBy: "system" },
    { code: "03", districtCode: "06", provinceCode: "01", nameLo: "ນາຄວາຍ", nameEn: "Nakhouay", createdBy: "system" },
    { code: "04", districtCode: "06", provinceCode: "01", nameLo: "ດົງໂພສີ", nameEn: "Dongphosy", createdBy: "system" },
    { code: "05", districtCode: "06", provinceCode: "01", nameLo: "ທ່າງ່ອນ", nameEn: "Thangon", createdBy: "system" },
    { code: "06", districtCode: "06", provinceCode: "01", nameLo: "ນາສ້າງ", nameEn: "Nasang", createdBy: "system" },
    { code: "07", districtCode: "06", provinceCode: "01", nameLo: "ໂພນສະອາດ", nameEn: "Phonsaath", createdBy: "system" },
    { code: "08", districtCode: "06", provinceCode: "01", nameLo: "ດົງໂດກ", nameEn: "Dongdok", createdBy: "system" },
    { code: "09", districtCode: "06", provinceCode: "01", nameLo: "ໂພນຕ້ອງ", nameEn: "Phontong", createdBy: "system" },
    { code: "10", districtCode: "06", provinceCode: "01", nameLo: "ນາຍາງ", nameEn: "Nayang", createdBy: "system" },
    // === ເມືອງ ຫາດຊາຍຟອງ (Hadxaifong) — districtCode 07 ===
    { code: "01", districtCode: "07", provinceCode: "01", nameLo: "ຫາດຊາຍຟອງ", nameEn: "Hadxaifong", createdBy: "system" },
    { code: "02", districtCode: "07", provinceCode: "01", nameLo: "ດົງໂພສີ", nameEn: "Dongphosy", createdBy: "system" },
    { code: "03", districtCode: "07", provinceCode: "01", nameLo: "ໜອງໜ້ຽວ", nameEn: "Nongniew", createdBy: "system" },
    { code: "04", districtCode: "07", provinceCode: "01", nameLo: "ທ່າເດື່ອ", nameEn: "Thadeua", createdBy: "system" },
    { code: "05", districtCode: "07", provinceCode: "01", nameLo: "ໂພນປ່າເປົ້າ", nameEn: "Phonpapao", createdBy: "system" },
    { code: "06", districtCode: "07", provinceCode: "01", nameLo: "ໜອງແຮດ", nameEn: "Nonghed", createdBy: "system" },
    { code: "07", districtCode: "07", provinceCode: "01", nameLo: "ດອນດູ່", nameEn: "Dondou", createdBy: "system" },
    { code: "08", districtCode: "07", provinceCode: "01", nameLo: "ຫ້ວຍຫົງ", nameEn: "Houayhong", createdBy: "system" },
    { code: "09", districtCode: "07", provinceCode: "01", nameLo: "ດົງໂພນເລົາ", nameEn: "Dongphonlao", createdBy: "system" },
    { code: "10", districtCode: "07", provinceCode: "01", nameLo: "ນາຄຳ", nameEn: "Nakham", createdBy: "system" },
    // === ເມືອງ ສັງທອງ (Sangthong) — districtCode 08 ===
    { code: "01", districtCode: "08", provinceCode: "01", nameLo: "ສັງທອງ", nameEn: "Sangthong", createdBy: "system" },
    { code: "02", districtCode: "08", provinceCode: "01", nameLo: "ທ່ານາ", nameEn: "Thana", createdBy: "system" },
    { code: "03", districtCode: "08", provinceCode: "01", nameLo: "ນາຊິງ", nameEn: "Naxing", createdBy: "system" },
    { code: "04", districtCode: "08", provinceCode: "01", nameLo: "ຫ້ວຍໂມງ", nameEn: "Houaymong", createdBy: "system" },
    { code: "05", districtCode: "08", provinceCode: "01", nameLo: "ນາງົວ", nameEn: "Nangoua", createdBy: "system" },
    { code: "06", districtCode: "08", provinceCode: "01", nameLo: "ດອນກາງ", nameEn: "Donkang", createdBy: "system" },
    { code: "07", districtCode: "08", provinceCode: "01", nameLo: "ປາກຫ້ວຍ", nameEn: "Pakhouay", createdBy: "system" },
    { code: "08", districtCode: "08", provinceCode: "01", nameLo: "ນາກອກ", nameEn: "Nakok", createdBy: "system" },
    { code: "09", districtCode: "08", provinceCode: "01", nameLo: "ນາສະຫວ່າງ", nameEn: "Nasavang", createdBy: "system" },
    { code: "10", districtCode: "08", provinceCode: "01", nameLo: "ຫີນເຫີບ", nameEn: "Hinheup", createdBy: "system" },
    // === ເມືອງ ປາກງື່ມ (Pakngum) — districtCode 09 ===
    { code: "01", districtCode: "09", provinceCode: "01", nameLo: "ປາກງື່ມ", nameEn: "Pakngum", createdBy: "system" },
    { code: "02", districtCode: "09", provinceCode: "01", nameLo: "ນາທອມ", nameEn: "Nathom", createdBy: "system" },
    { code: "03", districtCode: "09", provinceCode: "01", nameLo: "ນາໂຄກ", nameEn: "Nakhok", createdBy: "system" },
    { code: "04", districtCode: "09", provinceCode: "01", nameLo: "ທ່າບົກ", nameEn: "Thabok", createdBy: "system" },
    { code: "05", districtCode: "09", provinceCode: "01", nameLo: "ໂພນໂຮງ", nameEn: "Phonhong", createdBy: "system" },
    { code: "06", districtCode: "09", provinceCode: "01", nameLo: "ປາກຊັນ", nameEn: "Pakxan", createdBy: "system" },
    { code: "07", districtCode: "09", provinceCode: "01", nameLo: "ຫ້ວຍກົ່ວ", nameEn: "Houaykoua", createdBy: "system" },
    { code: "08", districtCode: "09", provinceCode: "01", nameLo: "ດອນຊິງຊູ", nameEn: "Donxingxou", createdBy: "system" },
    { code: "09", districtCode: "09", provinceCode: "01", nameLo: "ນາສ້ຽວ", nameEn: "Nasiew", createdBy: "system" },
    { code: "10", districtCode: "09", provinceCode: "01", nameLo: "ຫາດດອກແກ້ວ", nameEn: "Haddokkeo", createdBy: "system" },
];
async function main() {
    // 1. Delete all existing villages
    console.log("🗑️  Deleting existing villages...");
    const deleted = await prisma_1.prisma.village.deleteMany();
    console.log(`🗑️  Deleted ${deleted.count} existing villages`);
    // 2. Load districts to validate that each village's district exists.
    //    District unique code = provinceCode + districtCode (e.g. "0101"), same as district.insert.ts.
    const districts = await prisma_1.prisma.district.findMany({
        select: { id: true, code: true },
    });
    const districtCodes = new Set(districts.map((d) => d.code));
    // 3. Map villages and validate their district code
    const villagesToInsert = villages
        .map((village) => {
        const districtUniqueCode = `${village.provinceCode}${village.districtCode}`;
        if (!districtCodes.has(districtUniqueCode)) {
            console.error(`❌ District code ${districtUniqueCode} not found for village ${village.nameEn} (${village.code})`);
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
    const result = await prisma_1.prisma.village.createMany({
        data: villagesToInsert,
        skipDuplicates: true,
    });
    console.log(`\n✅ Successfully inserted ${result.count} villages`);
    if (result.count < villagesToInsert.length) {
        console.log(`⚠️  ${villagesToInsert.length - result.count} villages were skipped (duplicates)`);
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
// npx ts-node -r tsconfig-paths/register src/features/village/village.insert.ts
