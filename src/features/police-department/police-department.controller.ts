import type { Request, Response } from "express";
import {
  policeDepartmentCreateSchema,
  policeDepartmentUpdateSchema,
} from "./police-department.validate";
import {
  ResponseSuccess,
  ResponsePaginationSuccess,
} from "@utils/response-format";
import {
  createPoliceDepartmentService,
  deletePoliceDepartmentService,
  getAllPoliceDepartmentsService,
  getPoliceDepartmentByIdService,
  updatePoliceDepartmentService,
} from "./police-department.service";
import {
  idSchema,
  paginationSchema,
} from "@src/shared/validations/common.validate";

const policeDepartmentController = {
  createPoliceDepartment,
  getAllPoliceDepartments,
  getPoliceDepartmentById,
  updatePoliceDepartment,
  deletePoliceDepartment,
};

async function createPoliceDepartment(req: Request, res: Response) {
  const validatedData = policeDepartmentCreateSchema.parse(req.body);
  const result = await createPoliceDepartmentService(validatedData, "admin");
  ResponseSuccess(res, result);
}

async function getAllPoliceDepartments(req: Request, res: Response) {
  const { page, limit = 100 } = paginationSchema.parse(req.query);
  const result = await getAllPoliceDepartmentsService(page, limit);
  const { policeDepartments, total } = result;
  ResponsePaginationSuccess(res, policeDepartments, page, limit, total);
}

async function getPoliceDepartmentById(req: Request, res: Response) {
  const { id } = idSchema.parse(req.params);
  const result = await getPoliceDepartmentByIdService(id);
  ResponseSuccess(res, result);
}

async function updatePoliceDepartment(req: Request, res: Response) {
  const { id } = idSchema.parse(req.params);
  const validatedData = policeDepartmentUpdateSchema.parse(req.body);
  const result = await updatePoliceDepartmentService(
    id,
    validatedData,
    "admin",
  );
  ResponseSuccess(res, result);
}

async function deletePoliceDepartment(req: Request, res: Response) {
  const { id } = idSchema.parse(req.params);
  const result = await deletePoliceDepartmentService(id);
  ResponseSuccess(res, result);
}

export default policeDepartmentController;
