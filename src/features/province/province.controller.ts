import type { Request, Response } from "express";
import {
  provinceCreateSchema,
  provinceUpdateSchema,
} from "./province.validate";
import {
  ResponseSuccess,
  ResponsePaginationSuccess,
} from "@utils/response-format";
import {
  createProvinceService,
  deleteProvinceService,
  getAllProvincesService,
  getProvinceByIdService,
  updateProvinceService,
} from "./province.service";
import {
  idSchema,
  paginationSchema,
} from "@src/shared/validations/common.validate";

const provinceController = {
  createProvince,
  getAllProvinces,
  getProvinceById,
  updateProvince,
  deleteProvince,
};

async function createProvince(req: Request, res: Response) {
  const validatedData = provinceCreateSchema.parse(req.body);
  const result = await createProvinceService(validatedData, "admin");
  ResponseSuccess(res, result);
}

async function getAllProvinces(req: Request, res: Response) {
  const { page, limit = 100 } = paginationSchema.parse(req.query);
  const result = await getAllProvincesService(page, limit);
  const { provinces, total } = result;
  ResponsePaginationSuccess(res, provinces, page, limit, total);
}

async function getProvinceById(req: Request, res: Response) {
  const { id } = idSchema.parse(req.params);
  const result = await getProvinceByIdService(id);
  ResponseSuccess(res, result);
}

async function updateProvince(req: Request, res: Response) {
  const { id } = idSchema.parse(req.params);
  const validatedData = provinceUpdateSchema.parse(req.body);
  const result = await updateProvinceService(id, validatedData, "admin");
  ResponseSuccess(res, result);
}

async function deleteProvince(req: Request, res: Response) {
  const { id } = idSchema.parse(req.params);
  const result = await deleteProvinceService(id);
  ResponseSuccess(res, result);
}

export default provinceController;
