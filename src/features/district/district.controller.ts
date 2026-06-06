import {
  idSchema,
  paginationSchema,
} from "@src/shared/validations/common.validate";
import {
  ResponsePaginationSuccess,
  ResponseSuccess,
} from "@utils/response-format";
import type { Request, Response } from "express";
import {
  // createDistrictService,
  deleteDistrictService,
  getAllDistrictsService,
  getDistrictByIdService,
  updateDistrictService,
} from "./district.service";
import {
  districtCreateSchema,
  districtUpdateSchema,
  querySchema,
} from "./district.validate";

const districtController = {
  // createDistrict,
  getAllDistricts,
  getDistrictById,
  updateDistrict,
  deleteDistrict,
};

// async function createDistrict(req: Request, res: Response) {
//   const validatedData = districtCreateSchema.parse(req.body);
//   const result = await createDistrictService(validatedData, "admin");
//   ResponseSuccess(res, result);
// }

async function getAllDistricts(req: Request, res: Response) {
  const { page, limit } = paginationSchema.parse(req.query);
  const { provinceCode } = querySchema.parse(req.query);
  const result = await getAllDistrictsService(page, limit, provinceCode);
  const { districts, total } = result;
  ResponsePaginationSuccess(res, districts, page, limit, total);
}

async function getDistrictById(req: Request, res: Response) {
  const { id } = idSchema.parse(req.params);
  const result = await getDistrictByIdService(id);
  ResponseSuccess(res, result);
}

async function updateDistrict(req: Request, res: Response) {
  const { id } = idSchema.parse(req.params);
  const validatedData = districtUpdateSchema.parse(req.body);
  const result = await updateDistrictService(id, validatedData, "admin");
  ResponseSuccess(res, result);
}

async function deleteDistrict(req: Request, res: Response) {
  const { id } = idSchema.parse(req.params);
  const result = await deleteDistrictService(id);
  ResponseSuccess(res, result);
}

export default districtController;
