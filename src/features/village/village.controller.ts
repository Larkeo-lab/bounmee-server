import type { Request, Response } from "express";
import {
  ResponseSuccess,
  ResponsePaginationSuccess,
} from "@utils/response-format";
import {
  deleteVillageService,
  getAllVillagesService,
  getVillageByIdService,
  updateVillageService,
} from "./village.service";
import {
  idSchema,
  paginationSchema,
} from "@src/shared/validations/common.validate";
import {
  querySchema,
  villageUpdateSchema,
} from "./village.validate";

const villageController = {
  getAllVillages,
  getVillageById,
  updateVillage,
  deleteVillage,
};

async function getAllVillages(req: Request, res: Response) {
  const { page, limit } = paginationSchema.parse(req.query);
  const { districtCode, provinceCode } = querySchema.parse(req.query);
  const result = await getAllVillagesService(page, limit, districtCode, provinceCode);
  const { villages, total } = result;
  ResponsePaginationSuccess(res, villages, page, limit, total);
}

async function getVillageById(req: Request, res: Response) {
  const { id } = idSchema.parse(req.params);
  const result = await getVillageByIdService(id);
  ResponseSuccess(res, result);
}

async function updateVillage(req: Request, res: Response) {
  const { id } = idSchema.parse(req.params);
  const validatedData = villageUpdateSchema.parse(req.body);
  const result = await updateVillageService(id, validatedData, "admin");
  ResponseSuccess(res, result);
}

async function deleteVillage(req: Request, res: Response) {
  const { id } = idSchema.parse(req.params);
  const result = await deleteVillageService(id);
  ResponseSuccess(res, result);
}

export default villageController;
