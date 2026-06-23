import type { Request, Response } from "express";
import {
  villageChiefCreateSchema,
  villageChiefUpdateSchema,
} from "./village-chief.validate";
import {
  ResponseSuccess,
  ResponsePaginationSuccess,
} from "@utils/response-format";
import {
  createVillageChiefService,
  deleteVillageChiefService,
  getAllVillageChiefsService,
  getVillageChiefByIdService,
  updateMyVillageChiefService,
  updateVillageChiefService,
} from "./village-chief.service";
import {
  idSchema,
  paginationSchema,
} from "@src/shared/validations/common.validate";

const villageChiefController = {
  createVillageChief,
  getAllVillageChiefs,
  getVillageChiefById,
  updateVillageChief,
  updateMyVillageChief,
  deleteVillageChief,
};

async function createVillageChief(req: Request, res: Response) {
  const validatedData = villageChiefCreateSchema.parse(req.body);
  const createdBy = res.locals.payload?.userId || "system";
  const result = await createVillageChiefService(validatedData, createdBy);
  ResponseSuccess(res, result);
}

async function getAllVillageChiefs(req: Request, res: Response) {
  const { page, limit = 100 } = paginationSchema.parse(req.query);
  const result = await getAllVillageChiefsService(page, limit);
  const { villageChiefs, total } = result;
  ResponsePaginationSuccess(res, villageChiefs, page, limit, total);
}

async function getVillageChiefById(req: Request, res: Response) {
  const { id } = idSchema.parse(req.params);
  const result = await getVillageChiefByIdService(id);
  ResponseSuccess(res, result);
}

async function updateVillageChief(req: Request, res: Response) {
  const { id } = idSchema.parse(req.params);
  const validatedData = villageChiefUpdateSchema.parse(req.body);
  const updatedBy = res.locals.payload?.userId || "system";
  const result = await updateVillageChiefService(id, validatedData, updatedBy);
  ResponseSuccess(res, result);
}

async function updateMyVillageChief(req: Request, res: Response) {
  const userId = res.locals.payload?.userId;
  const validatedData = villageChiefUpdateSchema.parse(req.body);
  const result = await updateMyVillageChiefService(userId, validatedData);
  ResponseSuccess(res, result);
}

async function deleteVillageChief(req: Request, res: Response) {
  const { id } = idSchema.parse(req.params);
  const result = await deleteVillageChiefService(id);
  ResponseSuccess(res, result);
}

export default villageChiefController;
