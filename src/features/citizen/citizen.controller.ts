import type { Request, Response } from "express";
import { citizenUpdateSchema } from "./citizen.validate";
import {
  ResponseSuccess,
  ResponsePaginationSuccess,
} from "@utils/response-format";
import {
  deleteCitizenService,
  getAllCitizensService,
  getCitizenByIdService,
  updateCitizenService,
} from "./citizen.service";
import {
  idSchema,
  paginationSchema,
} from "@src/shared/validations/common.validate";

const citizenController = {
  getAllCitizens,
  getCitizenById,
  updateCitizen,
  deleteCitizen,
};



async function getAllCitizens(req: Request, res: Response) {
  const { page, limit = 100 } = paginationSchema.parse(req.query);
  const result = await getAllCitizensService(page, limit);
  const { citizens, total } = result;
  ResponsePaginationSuccess(res, citizens, page, limit, total);
}

async function getCitizenById(req: Request, res: Response) {
  const { id } = idSchema.parse(req.params);
  const result = await getCitizenByIdService(id);
  ResponseSuccess(res, result);
}

async function updateCitizen(req: Request, res: Response) {
  const { id } = idSchema.parse(req.params);
  const validatedData = citizenUpdateSchema.parse(req.body);
  const result = await updateCitizenService(id, validatedData, "admin");
  ResponseSuccess(res, result);
}

async function deleteCitizen(req: Request, res: Response) {
  const { id } = idSchema.parse(req.params);
  const result = await deleteCitizenService(id);
  ResponseSuccess(res, result);
}

export default citizenController;
