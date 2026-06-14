import type { Request, Response } from "express";
import {
  policeDistrictCreateSchema,
  policeDistrictUpdateSchema,
} from "./police-district.validate";
import {
  ResponseSuccess,
  ResponsePaginationSuccess,
} from "@utils/response-format";
import {
  createPoliceDistrictService,
  deletePoliceDistrictService,
  getAllPoliceDistrictsService,
  getPoliceDistrictByIdService,
  updatePoliceDistrictService,
} from "./police-district.service";
import {
  idSchema,
  paginationSchema,
} from "@src/shared/validations/common.validate";

const policeDistrictController = {
  createPoliceDistrict,
  getAllPoliceDistricts,
  getPoliceDistrictById,
  updatePoliceDistrict,
  deletePoliceDistrict,
};

async function createPoliceDistrict(req: Request, res: Response) {
  const validatedData = policeDistrictCreateSchema.parse(req.body);
  const createdBy = res.locals.payload?.userId || "system";
  const result = await createPoliceDistrictService(validatedData, createdBy);
  ResponseSuccess(res, result);
}

async function getAllPoliceDistricts(req: Request, res: Response) {
  const { page, limit = 100 } = paginationSchema.parse(req.query);
  const result = await getAllPoliceDistrictsService(page, limit);
  const { policeDistricts, total } = result;
  ResponsePaginationSuccess(res, policeDistricts, page, limit, total);
}

async function getPoliceDistrictById(req: Request, res: Response) {
  const { id } = idSchema.parse(req.params);
  const result = await getPoliceDistrictByIdService(id);
  ResponseSuccess(res, result);
}

async function updatePoliceDistrict(req: Request, res: Response) {
  const { id } = idSchema.parse(req.params);
  const validatedData = policeDistrictUpdateSchema.parse(req.body);
  const updatedBy = res.locals.payload?.userId || "system";
  const result = await updatePoliceDistrictService(id, validatedData, updatedBy);
  ResponseSuccess(res, result);
}

async function deletePoliceDistrict(req: Request, res: Response) {
  const { id } = idSchema.parse(req.params);
  const result = await deletePoliceDistrictService(id);
  ResponseSuccess(res, result);
}

export default policeDistrictController;
