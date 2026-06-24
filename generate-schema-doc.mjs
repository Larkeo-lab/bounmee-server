import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  TextRun,
  AlignmentType,
  WidthType,
  BorderStyle,
  HeadingLevel,
  ShadingType,
  VerticalAlign,
  PageBreak,
  TableLayoutType,
  PageOrientation,
} from "docx";

// Landscape A4: total usable width = 15840 - 720 - 720 = 14400 twips
const PAGE_WIDTH = 14400;
const COL_NO = 900;        // ~6%
const COL_FIELD = 2700;    // ~19%
const COL_TYPE = 3200;     // ~22%
const COL_CONST = 3400;    // ~24%
const COL_DESC = 4200;     // ~29%

const ENUM_COL_NO = 1400;
const ENUM_COL_VAL = 5500;
const ENUM_COL_DESC = 7500;
import fs from "fs";
import path from "path";

// ─── Schema Data Definitions ────────────────────────────────────────────────

const models = [
  {
    name: "Citizen",
    tableName: "citizens",
    description: "ຕາຕະລາງເກັບຮັກສາຂໍ້ມູນພົນລະເມືອງ (ປະຊາຊົນ)",
    fields: [
      { name: "id", type: "String (UUID)", constraints: "Primary Key, Auto-generated UUID", description: "ລະຫັດເອກະລັກຂອງພົນລະເມືອງ" },
      { name: "firstName", type: "String (VarChar 50)", constraints: "Required", description: "ຊື່ແທ້" },
      { name: "lastName", type: "String (VarChar 50)", constraints: "Required", description: "ນາມສະກຸນ" },
      { name: "dateOfBirth", type: "DateTime (Date)", constraints: "Required", description: "ວັນ ເດືອນ ປີ ເກີດ" },
      { name: "gender", type: "Gender (Enum)", constraints: "Default: MALE", description: "ເພດ (MALE / FEMALE / OTHER)" },
      { name: "cartNumber", type: "String (VarChar 20)", constraints: "Required", description: "ເລກບັດ" },
      { name: "cartImage", type: "String (VarChar 255)", constraints: "Required", description: "ຮູບບັດດ້ານໜ້າ" },
      { name: "cartImageBack", type: "String (VarChar 255)", constraints: "Optional", description: "ຮູບບັດດ້ານຫຼັງ" },
      { name: "createdAt", type: "DateTime", constraints: "Default: now()", description: "ວັນທີສ້າງ" },
      { name: "updatedAt", type: "DateTime", constraints: "Auto-update", description: "ວັນທີອັບເດດລ່າສຸດ" },
      { name: "createdBy", type: "String (VarChar 100)", constraints: "Optional", description: "ຜູ້ສ້າງ" },
      { name: "updatedBy", type: "String (VarChar 100)", constraints: "Optional", description: "ຜູ້ອັບເດດ" },
    ],
    relations: [
      { field: "users", type: "User[]", description: "ຜູ້ໃຊ້ທີ່ເຊື່ອມໂຍງກັບພົນລະເມືອງ (One-to-Many)" },
    ],
  },
  {
    name: "User",
    tableName: "user",
    description: "ຕາຕະລາງເກັບຮັກສາຂໍ້ມູນຜູ້ໃຊ້ລະບົບ",
    fields: [
      { name: "id", type: "String (UUID)", constraints: "Primary Key, Auto-generated UUID", description: "ລະຫັດເອກະລັກຂອງຜູ້ໃຊ້" },
      { name: "userName", type: "String (VarChar 50)", constraints: "Required, Unique", description: "ຊື່ຜູ້ໃຊ້ (Username)" },
      { name: "email", type: "String (VarChar 50)", constraints: "Optional, Unique", description: "ອີເມວ" },
      { name: "phone", type: "String (VarChar 20)", constraints: "Optional, Unique", description: "ເບີໂທລະສັບ" },
      { name: "profileImage", type: "String (VarChar 255)", constraints: "Optional", description: "ຮູບໂປຣໄຟລ໌" },
      { name: "password", type: "String (VarChar 255)", constraints: "Optional", description: "ລະຫັດຜ່ານ (Hashed)" },
      { name: "provinceId", type: "String (UUID)", constraints: "Optional, FK → Province", description: "ລະຫັດແຂວງ" },
      { name: "districtId", type: "String (UUID)", constraints: "Optional, FK → District", description: "ລະຫັດເມືອງ" },
      { name: "villageId", type: "String (UUID)", constraints: "Optional, FK → Village", description: "ລະຫັດບ້ານ" },
      { name: "address", type: "String", constraints: "Optional", description: "ທີ່ຢູ່" },
      { name: "policeDepartmentId", type: "String (UUID)", constraints: "Optional, FK → PoliceDepartment", description: "ລະຫັດກົມຕຳລວດ" },
      { name: "citizenId", type: "String (UUID)", constraints: "Optional, FK → Citizen", description: "ລະຫັດພົນລະເມືອງ" },
      { name: "policeDistrictId", type: "String (UUID)", constraints: "Optional, FK → PoliceDistrict", description: "ລະຫັດຕຳລວດເມືອງ" },
      { name: "villageChiefId", type: "String (UUID)", constraints: "Optional, FK → VillageChief", description: "ລະຫັດນາຍບ້ານ" },
      { name: "userType", type: "UserType (Enum)", constraints: "Default: CITIZEN", description: "ປະເພດຜູ້ໃຊ້" },
      { name: "isActive", type: "Boolean", constraints: "Default: true", description: "ສະຖານະການໃຊ້ງານ" },
      { name: "storeId", type: "String (UUID)", constraints: "Optional", description: "ລະຫັດຮ້ານ" },
      { name: "createdAt", type: "DateTime", constraints: "Default: now()", description: "ວັນທີສ້າງ" },
      { name: "updatedAt", type: "DateTime", constraints: "Auto-update", description: "ວັນທີອັບເດດລ່າສຸດ" },
    ],
    relations: [
      { field: "province", type: "Province?", description: "ແຂວງ (Many-to-One)" },
      { field: "district", type: "District?", description: "ເມືອງ (Many-to-One)" },
      { field: "village", type: "Village?", description: "ບ້ານ (Many-to-One)" },
      { field: "policeDepartment", type: "PoliceDepartment?", description: "ກົມຕຳລວດ (Many-to-One)" },
      { field: "citizen", type: "Citizen?", description: "ພົນລະເມືອງ (Many-to-One)" },
      { field: "policeDistrict", type: "PoliceDistrict?", description: "ຕຳລວດເມືອງ (Many-to-One)" },
      { field: "villageChief", type: "VillageChief?", description: "ນາຍບ້ານ (Many-to-One)" },
      { field: "report", type: "Report[]", description: "ລາຍງານ (One-to-Many)" },
    ],
  },
  {
    name: "Province",
    tableName: "provinces",
    description: "ຕາຕະລາງເກັບຮັກສາຂໍ້ມູນແຂວງ",
    fields: [
      { name: "id", type: "String (UUID)", constraints: "Primary Key, Auto-generated UUID", description: "ລະຫັດເອກະລັກ" },
      { name: "code", type: "String (VarChar 100)", constraints: "Required, Unique", description: "ລະຫັດແຂວງ" },
      { name: "nameLo", type: "String (VarChar 100)", constraints: "Required", description: "ຊື່ແຂວງ (ພາສາລາວ)" },
      { name: "nameEn", type: "String (VarChar 100)", constraints: "Required", description: "ຊື່ແຂວງ (ພາສາອັງກິດ)" },
      { name: "createdAt", type: "DateTime", constraints: "Default: now()", description: "ວັນທີສ້າງ" },
      { name: "updatedAt", type: "DateTime", constraints: "Auto-update", description: "ວັນທີອັບເດດລ່າສຸດ" },
      { name: "createdBy", type: "String (VarChar 100)", constraints: "Optional", description: "ຜູ້ສ້າງ" },
      { name: "updatedBy", type: "String (VarChar 100)", constraints: "Optional", description: "ຜູ້ອັບເດດ" },
    ],
    relations: [
      { field: "users", type: "User[]", description: "ຜູ້ໃຊ້ໃນແຂວງ (One-to-Many)" },
      { field: "reports", type: "Report[]", description: "ລາຍງານໃນແຂວງ (One-to-Many)" },
    ],
  },
  {
    name: "District",
    tableName: "districts",
    description: "ຕາຕະລາງເກັບຮັກສາຂໍ້ມູນເມືອງ",
    fields: [
      { name: "id", type: "String (UUID)", constraints: "Primary Key, Auto-generated UUID", description: "ລະຫັດເອກະລັກ" },
      { name: "code", type: "String (VarChar 100)", constraints: "Required", description: "ລະຫັດເມືອງ" },
      { name: "nameLo", type: "String (VarChar 100)", constraints: "Required", description: "ຊື່ເມືອງ (ພາສາລາວ)" },
      { name: "nameEn", type: "String (VarChar 100)", constraints: "Required", description: "ຊື່ເມືອງ (ພາສາອັງກິດ)" },
      { name: "provinceCode", type: "String (VarChar 100)", constraints: "Optional", description: "ລະຫັດແຂວງທີ່ສັງກັດ" },
      { name: "image", type: "String (VarChar 255)", constraints: "Optional", description: "ຮູບພາບ" },
      { name: "createdAt", type: "DateTime", constraints: "Default: now()", description: "ວັນທີສ້າງ" },
      { name: "updatedAt", type: "DateTime", constraints: "Auto-update", description: "ວັນທີອັບເດດລ່າສຸດ" },
      { name: "createdBy", type: "String (VarChar 100)", constraints: "Optional", description: "ຜູ້ສ້າງ" },
      { name: "updatedBy", type: "String (VarChar 100)", constraints: "Optional", description: "ຜູ້ອັບເດດ" },
    ],
    relations: [
      { field: "users", type: "User[]", description: "ຜູ້ໃຊ້ໃນເມືອງ (One-to-Many)" },
      { field: "reports", type: "Report[]", description: "ລາຍງານໃນເມືອງ (One-to-Many)" },
    ],
  },
  {
    name: "Village",
    tableName: "villages",
    description: "ຕາຕະລາງເກັບຮັກສາຂໍ້ມູນບ້ານ",
    fields: [
      { name: "id", type: "String (UUID)", constraints: "Primary Key, Auto-generated UUID", description: "ລະຫັດເອກະລັກ" },
      { name: "code", type: "String (VarChar 100)", constraints: "Required, Unique", description: "ລະຫັດບ້ານ" },
      { name: "nameLo", type: "String (VarChar 100)", constraints: "Required", description: "ຊື່ບ້ານ (ພາສາລາວ)" },
      { name: "nameEn", type: "String (VarChar 100)", constraints: "Required", description: "ຊື່ບ້ານ (ພາສາອັງກິດ)" },
      { name: "districtCode", type: "String (VarChar 100)", constraints: "Optional", description: "ລະຫັດເມືອງທີ່ສັງກັດ" },
      { name: "provinceCode", type: "String (VarChar 100)", constraints: "Optional", description: "ລະຫັດແຂວງທີ່ສັງກັດ" },
      { name: "image", type: "String (VarChar 255)", constraints: "Optional", description: "ຮູບພາບ" },
      { name: "createdAt", type: "DateTime", constraints: "Default: now()", description: "ວັນທີສ້າງ" },
      { name: "updatedAt", type: "DateTime", constraints: "Auto-update", description: "ວັນທີອັບເດດລ່າສຸດ" },
      { name: "createdBy", type: "String (VarChar 100)", constraints: "Optional", description: "ຜູ້ສ້າງ" },
      { name: "updatedBy", type: "String (VarChar 100)", constraints: "Optional", description: "ຜູ້ອັບເດດ" },
    ],
    relations: [
      { field: "users", type: "User[]", description: "ຜູ້ໃຊ້ໃນບ້ານ (One-to-Many)" },
      { field: "reports", type: "Report[]", description: "ລາຍງານໃນບ້ານ (One-to-Many)" },
    ],
  },
  {
    name: "PoliceDepartment",
    tableName: "police_departments",
    description: "ຕາຕະລາງເກັບຮັກສາຂໍ້ມູນກົມຕຳລວດ",
    fields: [
      { name: "id", type: "String (UUID)", constraints: "Primary Key, Auto-generated UUID", description: "ລະຫັດເອກະລັກ" },
      { name: "departmentName", type: "String (VarChar 50)", constraints: "Required", description: "ຊື່ກົມ" },
      { name: "chiefName", type: "String (VarChar 50)", constraints: "Optional", description: "ຊື່ຫົວໜ້າ" },
      { name: "deputyChiefName", type: "String (VarChar 50)", constraints: "Optional", description: "ຊື່ຮອງຫົວໜ້າ" },
      { name: "createdAt", type: "DateTime", constraints: "Default: now()", description: "ວັນທີສ້າງ" },
      { name: "updatedAt", type: "DateTime", constraints: "Auto-update", description: "ວັນທີອັບເດດລ່າສຸດ" },
      { name: "createdBy", type: "String (VarChar 100)", constraints: "Optional", description: "ຜູ້ສ້າງ" },
      { name: "updatedBy", type: "String (VarChar 100)", constraints: "Optional", description: "ຜູ້ອັບເດດ" },
    ],
    relations: [
      { field: "users", type: "User[]", description: "ຜູ້ໃຊ້ໃນກົມ (One-to-Many)" },
    ],
  },
  {
    name: "PoliceDistrict",
    tableName: "police_districts",
    description: "ຕາຕະລາງເກັບຮັກສາຂໍ້ມູນຕຳລວດເມືອງ",
    fields: [
      { name: "id", type: "String (UUID)", constraints: "Primary Key, Auto-generated UUID", description: "ລະຫັດເອກະລັກ" },
      { name: "chiefName", type: "String (VarChar 100)", constraints: "Required", description: "ຊື່ຫົວໜ້າ" },
      { name: "deputyChiefName", type: "String (VarChar 100)", constraints: "Required", description: "ຊື່ຮອງຫົວໜ້າ" },
      { name: "image", type: "String (VarChar 255)", constraints: "Optional", description: "ຮູບພາບ" },
      { name: "bgImage", type: "String (VarChar 255)", constraints: "Optional", description: "ຮູບພາບພື້ນຫຼັງ" },
      { name: "createdAt", type: "DateTime", constraints: "Default: now()", description: "ວັນທີສ້າງ" },
      { name: "updatedAt", type: "DateTime", constraints: "Auto-update", description: "ວັນທີອັບເດດລ່າສຸດ" },
      { name: "createdBy", type: "String (VarChar 100)", constraints: "Optional", description: "ຜູ້ສ້າງ" },
      { name: "updatedBy", type: "String (VarChar 100)", constraints: "Optional", description: "ຜູ້ອັບເດດ" },
    ],
    relations: [
      { field: "users", type: "User[]", description: "ຜູ້ໃຊ້ຕຳລວດເມືອງ (One-to-Many)" },
    ],
  },
  {
    name: "VillageChief",
    tableName: "village_chief",
    description: "ຕາຕະລາງເກັບຮັກສາຂໍ້ມູນນາຍບ້ານ",
    fields: [
      { name: "id", type: "String (UUID)", constraints: "Primary Key, Auto-generated UUID", description: "ລະຫັດເອກະລັກ" },
      { name: "chiefName", type: "String (VarChar 100)", constraints: "Required", description: "ຊື່ນາຍບ້ານ" },
      { name: "deputyChiefName", type: "String (VarChar 100)", constraints: "Required", description: "ຊື່ຮອງນາຍບ້ານ" },
      { name: "image", type: "String (VarChar 255)", constraints: "Optional", description: "ຮູບພາບ" },
      { name: "bgImage", type: "String (VarChar 255)", constraints: "Optional", description: "ຮູບພາບພື້ນຫຼັງ" },
      { name: "createdAt", type: "DateTime", constraints: "Default: now()", description: "ວັນທີສ້າງ" },
      { name: "updatedAt", type: "DateTime", constraints: "Auto-update", description: "ວັນທີອັບເດດລ່າສຸດ" },
      { name: "createdBy", type: "String (VarChar 100)", constraints: "Optional", description: "ຜູ້ສ້າງ" },
      { name: "updatedBy", type: "String (VarChar 100)", constraints: "Optional", description: "ຜູ້ອັບເດດ" },
    ],
    relations: [
      { field: "users", type: "User[]", description: "ຜູ້ໃຊ້ນາຍບ້ານ (One-to-Many)" },
    ],
  },
  {
    name: "Report",
    tableName: "report",
    description: "ຕາຕະລາງເກັບຮັກສາຂໍ້ມູນການລາຍງານ/ແຈ້ງຄວາມ",
    fields: [
      { name: "id", type: "String (UUID)", constraints: "Primary Key, Auto-generated UUID", description: "ລະຫັດເອກະລັກ" },
      { name: "title", type: "String", constraints: "Required", description: "ຫົວຂໍ້ລາຍງານ" },
      { name: "description", type: "String (Text)", constraints: "Optional", description: "ລາຍລະອຽດ" },
      { name: "provinceId", type: "String (UUID)", constraints: "Optional, FK → Province", description: "ລະຫັດແຂວງ" },
      { name: "districtId", type: "String (UUID)", constraints: "Optional, FK → District", description: "ລະຫັດເມືອງ" },
      { name: "villageId", type: "String (UUID)", constraints: "Optional, FK → Village", description: "ລະຫັດບ້ານ" },
      { name: "location", type: "String (Text)", constraints: "Required", description: "ສະຖານທີ່" },
      { name: "image", type: "String (Text)", constraints: "Optional", description: "ຮູບພາບຫຼັກ" },
      { name: "video", type: "String (Text)", constraints: "Optional", description: "ວິດີໂອ" },
      { name: "userId", type: "String (UUID)", constraints: "Required, FK → User", description: "ລະຫັດຜູ້ລາຍງານ" },
      { name: "attachments", type: "Json", constraints: "Optional", description: "ໄຟລ໌ແນບ" },
      { name: "status", type: "ReportStatus (Enum)", constraints: "Default: PENDING", description: "ສະຖານະລາຍງານ" },
      { name: "currentAssignee", type: "UserType (Enum)", constraints: "Default: VILLAGE_CHIEF", description: "ຜູ້ຮັບຜິດຊອບປັດຈຸບັນ" },
      { name: "createdAt", type: "DateTime (Timestamp)", constraints: "Default: now()", description: "ວັນທີສ້າງ" },
      { name: "updatedAt", type: "DateTime (Timestamp)", constraints: "Auto-update", description: "ວັນທີອັບເດດລ່າສຸດ" },
      { name: "evidenceDetail", type: "String (Text)", constraints: "Optional", description: "ຂໍ້ມູນຫຼັກຖານ" },
      { name: "caseConclusion", type: "String (Text)", constraints: "Optional", description: "ສະຫຼຸບຄະດີ" },
    ],
    relations: [
      { field: "province", type: "Province?", description: "ແຂວງ (Many-to-One)" },
      { field: "district", type: "District?", description: "ເມືອງ (Many-to-One)" },
      { field: "village", type: "Village?", description: "ບ້ານ (Many-to-One)" },
      { field: "user", type: "User", description: "ຜູ້ລາຍງານ (Many-to-One)" },
      { field: "history", type: "ReportHistory[]", description: "ປະຫວັດການດຳເນີນງານ (One-to-Many)" },
      { field: "reportMoreDetail", type: "ReportMoreDetail[]", description: "ຂໍ້ມູນເພີ່ມເຕີມ (One-to-Many)" },
    ],
  },
  {
    name: "ReportHistory",
    tableName: "report_history",
    description: "ຕາຕະລາງເກັບຮັກສາປະຫວັດການມອບໝາຍ / ສົ່ງຕໍ່ລາຍງານ",
    fields: [
      { name: "id", type: "String (UUID)", constraints: "Primary Key, Auto-generated UUID", description: "ລະຫັດເອກະລັກ" },
      { name: "reportId", type: "String (UUID)", constraints: "Required, FK → Report", description: "ລະຫັດລາຍງານ" },
      { name: "fromAssignee", type: "UserType (Enum)", constraints: "Optional", description: "ຜູ້ມອບໝາຍ (ຈາກ)" },
      { name: "toAssignee", type: "UserType (Enum)", constraints: "Required", description: "ຜູ້ຮັບມອບໝາຍ (ໄປ)" },
      { name: "byUserId", type: "String (UUID)", constraints: "Optional", description: "ລະຫັດຜູ້ດຳເນີນການ" },
      { name: "note", type: "String (Text)", constraints: "Optional", description: "ບັນທຶກ/ໝາຍເຫດ" },
      { name: "createdAt", type: "DateTime (Timestamp)", constraints: "Default: now()", description: "ວັນທີສ້າງ" },
    ],
    relations: [
      { field: "report", type: "Report", description: "ລາຍງານ (Many-to-One, Cascade Delete)" },
    ],
  },
  {
    name: "ReportMoreDetail",
    tableName: "report_more_detail",
    description: "ຕາຕະລາງເກັບຮັກສາຂໍ້ມູນລາຍລະອຽດເພີ່ມເຕີມຂອງລາຍງານ",
    fields: [
      { name: "id", type: "String (UUID)", constraints: "Primary Key, Auto-generated UUID", description: "ລະຫັດເອກະລັກ" },
      { name: "reportId", type: "String (UUID)", constraints: "Required, FK → Report", description: "ລະຫັດລາຍງານ" },
      { name: "detail", type: "String (Text)", constraints: "Required", description: "ລາຍລະອຽດ" },
      { name: "attachments", type: "String", constraints: "Optional", description: "ໄຟລ໌ແນບ" },
      { name: "images", type: "String[]", constraints: "Array", description: "ຮູບພາບ" },
      { name: "createdAt", type: "DateTime (Timestamp)", constraints: "Default: now()", description: "ວັນທີສ້າງ" },
      { name: "updatedAt", type: "DateTime (Timestamp)", constraints: "Auto-update", description: "ວັນທີອັບເດດລ່າສຸດ" },
    ],
    relations: [
      { field: "report", type: "Report", description: "ລາຍງານ (Many-to-One, Cascade Delete)" },
    ],
  },
  {
    name: "News",
    tableName: "news",
    description: "ຕາຕະລາງເກັບຮັກສາຂໍ້ມູນຂ່າວ",
    fields: [
      { name: "id", type: "String (UUID)", constraints: "Primary Key, Auto-generated UUID", description: "ລະຫັດເອກະລັກ" },
      { name: "title", type: "String (VarChar 255)", constraints: "Required", description: "ຫົວຂໍ້ຂ່າວ" },
      { name: "content", type: "String (Text)", constraints: "Required", description: "ເນື້ອໃນຂ່າວ" },
      { name: "image", type: "String (VarChar 255)", constraints: "Required", description: "ຮູບພາບ" },
      { name: "status", type: "NewsStatus (Enum)", constraints: "Default: PENDING", description: "ສະຖານະ" },
      { name: "createdAt", type: "DateTime (Timestamp)", constraints: "Default: now()", description: "ວັນທີສ້າງ" },
      { name: "updatedAt", type: "DateTime (Timestamp)", constraints: "Auto-update", description: "ວັນທີອັບເດດລ່າສຸດ" },
      { name: "createdBy", type: "String (VarChar 100)", constraints: "Optional", description: "ຜູ້ສ້າງ" },
      { name: "updatedBy", type: "String (VarChar 100)", constraints: "Optional", description: "ຜູ້ອັບເດດ" },
      { name: "isActive", type: "Boolean", constraints: "Default: true", description: "ສະຖານະການໃຊ້ງານ" },
    ],
    relations: [],
  },
];

const enums = [
  {
    name: "Gender",
    description: "ເພດ",
    values: [
      { value: "MALE", description: "ເພດຊາຍ" },
      { value: "FEMALE", description: "ເພດຍິງ" },
      { value: "OTHER", description: "ອື່ນໆ" },
    ],
  },
  {
    name: "UserType",
    description: "ປະເພດຜູ້ໃຊ້ລະບົບ",
    values: [
      { value: "POLICE_DEPARTMENT", description: "ກົມໃຫຍ່ຕຳລວດ" },
      { value: "DISTRICT_POLICE", description: "ຕຳລວດເມືອງ" },
      { value: "VILLAGE_CHIEF", description: "ນາຍບ້ານ" },
      { value: "CITIZEN", description: "ປະຊາຊົນ" },
    ],
  },
  {
    name: "ReportStatus",
    description: "ສະຖານະລາຍງານ",
    values: [
      { value: "PENDING", description: "ລໍຖ້າດຳເນີນການ" },
      { value: "IN_PROGRESS", description: "ກຳລັງດຳເນີນການ" },
      { value: "REJECTED", description: "ປະຕິເສດ" },
      { value: "APPROVED", description: "ອະນຸມັດ" },
      { value: "CANCELLED", description: "ຍົກເລີກ" },
    ],
  },
  {
    name: "NewsStatus",
    description: "ສະຖານະຂ່າວ",
    values: [
      { value: "PENDING", description: "ລໍຖ້າເຜີຍແຜ່" },
      { value: "ACTIVE", description: "ເຜີຍແຜ່ແລ້ວ" },
      { value: "INACTIVE", description: "ຍົກເລີກ" },
    ],
  },
];

// ─── Colors ─────────────────────────────────────────────────────────────────

const COLORS = {
  headerBg: "1B4332",      // Deep green
  headerText: "FFFFFF",
  subHeaderBg: "2D6A4F",   // Medium green
  subHeaderText: "FFFFFF",
  lightGreenBg: "D8F3DC",  // Light green
  evenRowBg: "F0F7F4",     // Very light green
  oddRowBg: "FFFFFF",
  borderColor: "40916C",
  titleColor: "1B4332",
  enumHeaderBg: "081C15",   // Darkest green
  enumHeaderText: "FFFFFF",
};

// ─── Helpers ────────────────────────────────────────────────────────────────

const tableBorders = {
  top: { style: BorderStyle.SINGLE, size: 1, color: COLORS.borderColor },
  bottom: { style: BorderStyle.SINGLE, size: 1, color: COLORS.borderColor },
  left: { style: BorderStyle.SINGLE, size: 1, color: COLORS.borderColor },
  right: { style: BorderStyle.SINGLE, size: 1, color: COLORS.borderColor },
  insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: COLORS.borderColor },
  insideVertical: { style: BorderStyle.SINGLE, size: 1, color: COLORS.borderColor },
};

function createHeaderCell(text, width) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    shading: { fill: COLORS.headerBg, type: ShadingType.CLEAR },
    verticalAlign: VerticalAlign.CENTER,
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 60, after: 60 },
        children: [
          new TextRun({
            text: text,
            bold: true,
            color: COLORS.headerText,
            size: 20,
            font: "Phetsarath OT",
          }),
        ],
      }),
    ],
  });
}

function createDataCell(text, width, isEven, bold = false) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    shading: { fill: isEven ? COLORS.evenRowBg : COLORS.oddRowBg, type: ShadingType.CLEAR },
    verticalAlign: VerticalAlign.CENTER,
    children: [
      new Paragraph({
        spacing: { before: 40, after: 40 },
        indent: { left: 100 },
        children: [
          new TextRun({
            text: text,
            size: 18,
            font: "Phetsarath OT",
            bold: bold,
          }),
        ],
      }),
    ],
  });
}

function createRelationHeaderCell(text, width) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    shading: { fill: COLORS.subHeaderBg, type: ShadingType.CLEAR },
    verticalAlign: VerticalAlign.CENTER,
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 60, after: 60 },
        children: [
          new TextRun({
            text: text,
            bold: true,
            color: COLORS.subHeaderText,
            size: 20,
            font: "Phetsarath OT",
          }),
        ],
      }),
    ],
  });
}

// ─── Generate Model Section ─────────────────────────────────────────────────

function generateModelSection(model, index) {
  const paragraphs = [];

  // Spacing before each model
  if (index > 0) {
    paragraphs.push(new Paragraph({ spacing: { before: 400 } }));
  }

  // Model title
  paragraphs.push(
    new Paragraph({
      spacing: { before: 200, after: 100 },
      children: [
        new TextRun({
          text: `${index + 1}. Model: ${model.name}`,
          bold: true,
          size: 28,
          color: COLORS.titleColor,
          font: "Phetsarath OT",
        }),
      ],
    })
  );

  // Table name + description
  paragraphs.push(
    new Paragraph({
      spacing: { before: 60, after: 60 },
      children: [
        new TextRun({ text: "ຊື່ຕາຕະລາງ: ", bold: true, size: 20, font: "Phetsarath OT" }),
        new TextRun({ text: model.tableName, size: 20, font: "Phetsarath OT", italics: true }),
      ],
    })
  );
  paragraphs.push(
    new Paragraph({
      spacing: { before: 0, after: 100 },
      children: [
        new TextRun({ text: "ລາຍລະອຽດ: ", bold: true, size: 20, font: "Phetsarath OT" }),
        new TextRun({ text: model.description, size: 20, font: "Phetsarath OT" }),
      ],
    })
  );

  // Fields header
  const headerRow = new TableRow({
    tableHeader: true,
    children: [
      createHeaderCell("ລ/ດ", COL_NO),
      createHeaderCell("ຊື່ Field", COL_FIELD),
      createHeaderCell("ປະເພດ", COL_TYPE),
      createHeaderCell("ເງື່ອນໄຂ", COL_CONST),
      createHeaderCell("ລາຍລະອຽດ", COL_DESC),
    ],
  });

  // Fields data rows
  const dataRows = model.fields.map((field, i) => {
    const isEven = i % 2 === 0;
    return new TableRow({
      children: [
        createDataCell(`${i + 1}`, COL_NO, isEven),
        createDataCell(field.name, COL_FIELD, isEven, true),
        createDataCell(field.type, COL_TYPE, isEven),
        createDataCell(field.constraints, COL_CONST, isEven),
        createDataCell(field.description, COL_DESC, isEven),
      ],
    });
  });

  const tableRows = [headerRow, ...dataRows];

  // Relations section (if any)
  if (model.relations.length > 0) {
    // Relations header row (span all 5 columns)
    tableRows.push(
      new TableRow({
        children: [
          new TableCell({
            columnSpan: 5,
            shading: { fill: COLORS.lightGreenBg, type: ShadingType.CLEAR },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 80, after: 80 },
                children: [
                  new TextRun({
                    text: "ຄວາມສຳພັນ (Relations)",
                    bold: true,
                    size: 20,
                    color: COLORS.titleColor,
                    font: "Phetsarath OT",
                  }),
                ],
              }),
            ],
          }),
        ],
      })
    );

    // Relations sub-header
    tableRows.push(
      new TableRow({
        children: [
          createRelationHeaderCell("ລ/ດ", COL_NO),
          createRelationHeaderCell("Field", COL_FIELD),
          createRelationHeaderCell("ປະເພດ", COL_TYPE),
          new TableCell({
            columnSpan: 2,
            width: { size: COL_CONST + COL_DESC, type: WidthType.DXA },
            shading: { fill: COLORS.subHeaderBg, type: ShadingType.CLEAR },
            verticalAlign: VerticalAlign.CENTER,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 60, after: 60 },
                children: [
                  new TextRun({
                    text: "ລາຍລະອຽດ",
                    bold: true,
                    color: COLORS.subHeaderText,
                    size: 20,
                    font: "Phetsarath OT",
                  }),
                ],
              }),
            ],
          }),
        ],
      })
    );

    model.relations.forEach((rel, i) => {
      const isEven = i % 2 === 0;
      tableRows.push(
        new TableRow({
          children: [
            createDataCell(`${i + 1}`, COL_NO, isEven),
            createDataCell(rel.field, COL_FIELD, isEven, true),
            createDataCell(rel.type, COL_TYPE, isEven),
            new TableCell({
              columnSpan: 2,
              width: { size: COL_CONST + COL_DESC, type: WidthType.DXA },
              shading: { fill: isEven ? COLORS.evenRowBg : COLORS.oddRowBg, type: ShadingType.CLEAR },
              verticalAlign: VerticalAlign.CENTER,
              children: [
                new Paragraph({
                  spacing: { before: 40, after: 40 },
                  indent: { left: 100 },
                  children: [
                    new TextRun({ text: rel.description, size: 18, font: "Phetsarath OT" }),
                  ],
                }),
              ],
            }),
          ],
        })
      );
    });
  }

  const table = new Table({
    width: { size: PAGE_WIDTH, type: WidthType.DXA },
    layout: TableLayoutType.FIXED,
    borders: tableBorders,
    rows: tableRows,
  });

  paragraphs.push(table);

  return paragraphs;
}

// ─── Generate Enum Section ──────────────────────────────────────────────────

function generateEnumSection(enumDef, index) {
  const paragraphs = [];

  paragraphs.push(new Paragraph({ spacing: { before: 300 } }));

  paragraphs.push(
    new Paragraph({
      spacing: { before: 200, after: 100 },
      children: [
        new TextRun({
          text: `${index + 1}. Enum: ${enumDef.name}`,
          bold: true,
          size: 26,
          color: COLORS.titleColor,
          font: "Phetsarath OT",
        }),
      ],
    })
  );

  paragraphs.push(
    new Paragraph({
      spacing: { before: 0, after: 100 },
      children: [
        new TextRun({ text: "ລາຍລະອຽດ: ", bold: true, size: 20, font: "Phetsarath OT" }),
        new TextRun({ text: enumDef.description, size: 20, font: "Phetsarath OT" }),
      ],
    })
  );

  const headerRow = new TableRow({
    tableHeader: true,
    children: [
      new TableCell({
        width: { size: ENUM_COL_NO, type: WidthType.DXA },
        shading: { fill: COLORS.enumHeaderBg, type: ShadingType.CLEAR },
        verticalAlign: VerticalAlign.CENTER,
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 60, after: 60 },
            children: [new TextRun({ text: "ລ/ດ", bold: true, color: COLORS.enumHeaderText, size: 20, font: "Phetsarath OT" })],
          }),
        ],
      }),
      new TableCell({
        width: { size: ENUM_COL_VAL, type: WidthType.DXA },
        shading: { fill: COLORS.enumHeaderBg, type: ShadingType.CLEAR },
        verticalAlign: VerticalAlign.CENTER,
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 60, after: 60 },
            children: [new TextRun({ text: "ຄ່າ (Value)", bold: true, color: COLORS.enumHeaderText, size: 20, font: "Phetsarath OT" })],
          }),
        ],
      }),
      new TableCell({
        width: { size: ENUM_COL_DESC, type: WidthType.DXA },
        shading: { fill: COLORS.enumHeaderBg, type: ShadingType.CLEAR },
        verticalAlign: VerticalAlign.CENTER,
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 60, after: 60 },
            children: [new TextRun({ text: "ລາຍລະອຽດ", bold: true, color: COLORS.enumHeaderText, size: 20, font: "Phetsarath OT" })],
          }),
        ],
      }),
    ],
  });

  const valueRows = enumDef.values.map((val, i) => {
    const isEven = i % 2 === 0;
    return new TableRow({
      children: [
        createDataCell(`${i + 1}`, ENUM_COL_NO, isEven),
        createDataCell(val.value, ENUM_COL_VAL, isEven, true),
        createDataCell(val.description, ENUM_COL_DESC, isEven),
      ],
    });
  });

  const table = new Table({
    width: { size: PAGE_WIDTH, type: WidthType.DXA },
    layout: TableLayoutType.FIXED,
    borders: tableBorders,
    rows: [headerRow, ...valueRows],
  });

  paragraphs.push(table);

  return paragraphs;
}

// ─── Build Document ─────────────────────────────────────────────────────────

const sections = [];

// Title page content
const titleParagraphs = [
  new Paragraph({ spacing: { before: 2000 } }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
    children: [
      new TextRun({
        text: "ເອກະສານໂຄງສ້າງຖານຂໍ້ມູນ",
        bold: true,
        size: 48,
        color: COLORS.titleColor,
        font: "Phetsarath OT",
      }),
    ],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 100 },
    children: [
      new TextRun({
        text: "Database Schema Documentation",
        bold: true,
        size: 32,
        color: COLORS.subHeaderBg,
        font: "Phetsarath OT",
      }),
    ],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 400 },
    children: [
      new TextRun({
        text: "ລະບົບ Bounmee",
        size: 28,
        color: COLORS.headerBg,
        font: "Phetsarath OT",
      }),
    ],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 600 },
    children: [
      new TextRun({
        text: `ສ້າງວັນທີ: ${new Date().toLocaleDateString("lo-LA", { year: "numeric", month: "long", day: "numeric" })}`,
        size: 22,
        color: "666666",
        font: "Phetsarath OT",
      }),
    ],
  }),
];

// Models section heading
const modelsSectionParagraphs = [
  new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 200 },
    children: [
      new TextRun({
        text: "ພາກທີ 1: ໂຄງສ້າງ Models",
        bold: true,
        size: 36,
        color: COLORS.titleColor,
        font: "Phetsarath OT",
      }),
    ],
  }),
  new Paragraph({
    spacing: { after: 200 },
    children: [
      new TextRun({
        text: `ລະບົບມີທັງໝົດ ${models.length} Models ແລະ ${enums.length} Enums`,
        size: 22,
        font: "Phetsarath OT",
      }),
    ],
  }),
];

// All model tables
const modelParagraphs = models.flatMap((model, index) => generateModelSection(model, index));

// Enums section heading
const enumSectionParagraphs = [
  new Paragraph({ spacing: { before: 600 } }),
  new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 200 },
    children: [
      new TextRun({
        text: "ພາກທີ 2: Enums (ຄ່າຄົງທີ່)",
        bold: true,
        size: 36,
        color: COLORS.titleColor,
        font: "Phetsarath OT",
      }),
    ],
  }),
];

// All enum tables
const enumParagraphs = enums.flatMap((enumDef, index) => generateEnumSection(enumDef, index));

// Single section document — Landscape A4
const doc = new Document({
  sections: [
    {
      properties: {
        page: {
          size: {
            orientation: PageOrientation.LANDSCAPE,
            width: 15840,
            height: 12240,
          },
          margin: {
            top: 720,
            bottom: 720,
            left: 720,
            right: 720,
          },
        },
      },
      children: [
        ...titleParagraphs,
        ...modelsSectionParagraphs,
        ...modelParagraphs,
        ...enumSectionParagraphs,
        ...enumParagraphs,
      ],
    },
  ],
});

// ─── Export ──────────────────────────────────────────────────────────────────

const outputPath = path.resolve("Bounmee_Database_Schema.docx");

const buffer = await Packer.toBuffer(doc);
fs.writeFileSync(outputPath, buffer);

console.log(`✅ DOCX file generated successfully!`);
console.log(`📄 Output: ${outputPath}`);
