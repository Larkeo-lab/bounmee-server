import { idSchema, paginationSchema } from "@src/shared/validations/common.validate";
import { ResponsePaginationSuccess, ResponseSuccess } from "@utils/response-format";
import type { Request, Response } from "express";
import {
  createReportService,
  deleteReportService,
  forwardReportService,
  getAllReportsService,
  getReportByIdService,
  getVillageReportsService,
  updateReportService,
} from "./report.service";
import { reportCreateSchema, reportQuerySchema, reportUpdateSchema } from "./report.validate";

const reportController = {
  createReport,
  getAllReports,
  getReportById,
  getVillageReports,
  updateReport,
  forwardReport,
  deleteReport,
};

async function createReport(req: Request, res: Response) {
  const validatedData = reportCreateSchema.parse(req.body);
  const userId = res.locals.payload.userId;
  const result = await createReportService(validatedData, userId);
  ResponseSuccess(res, result, 201);
}

async function getAllReports(req: Request, res: Response) {
  const { page, limit } = paginationSchema.parse(req.query);
  const filters = reportQuerySchema.parse(req.query);
  const loggedInUserId = res.locals.payload?.userId;
  const result = await getAllReportsService(page, limit, filters, loggedInUserId);
  const { reports, total } = result;
  ResponsePaginationSuccess(res, reports, page, limit, total);
}

async function getReportById(req: Request, res: Response) {
  const { id } = idSchema.parse(req.params);
  const result = await getReportByIdService(id);
  ResponseSuccess(res, result);
}

async function getVillageReports(req: Request, res: Response) {
  const villageId = req.params.villageId;
  const result = await getVillageReportsService(villageId);
  ResponseSuccess(res, result);
}

async function updateReport(req: Request, res: Response) {
  const { id } = idSchema.parse(req.params);
  const validatedData = reportUpdateSchema.parse(req.body);
  const result = await updateReportService(id, validatedData);
  ResponseSuccess(res, result);
}

async function forwardReport(req: Request, res: Response) {
  const { id } = idSchema.parse(req.params);
  const byUserId = res.locals.payload.userId;
  const result = await forwardReportService(id, byUserId);
  ResponseSuccess(res, result);
}

async function deleteReport(req: Request, res: Response) {
  const { id } = idSchema.parse(req.params);
  const result = await deleteReportService(id);
  ResponseSuccess(res, result);
}

export default reportController;
