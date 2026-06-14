import type { Request, Response } from "express";
import {
  ResponseSuccess,
  ResponsePaginationSuccess,
} from "@utils/response-format";
import {
  createNewsService,
  deleteNewsService,
  getAllNewsService,
  getNewsByIdService,
  updateNewsService,
} from "./news.service";
import {
  idSchema,
  paginationSchema,
} from "@src/shared/validations/common.validate";
import {
  newsCreateSchema,
  newsUpdateSchema,
  querySchema,
} from "./news.validate";

const newsController = {
  createNews,
  getAllNews,
  getNewsById,
  updateNews,
  deleteNews,
};

async function createNews(req: Request, res: Response) {
  const validatedData = newsCreateSchema.parse(req.body);
  const createdBy = res.locals.payload?.userId || "system";
  const result = await createNewsService(validatedData, createdBy);
  ResponseSuccess(res, result);
}

async function getAllNews(req: Request, res: Response) {
  const { page, limit } = paginationSchema.parse(req.query);
  const { status, search, isActive, createdBy } = querySchema.parse(req.query);
  const result = await getAllNewsService(
    page,
    limit,
    status,
    search,
    isActive,
    createdBy,
  );
  const { news, total } = result;
  ResponsePaginationSuccess(res, news, page, limit, total);
}

async function getNewsById(req: Request, res: Response) {
  const { id } = idSchema.parse(req.params);
  const result = await getNewsByIdService(id);
  ResponseSuccess(res, result);
}

async function updateNews(req: Request, res: Response) {
  const { id } = idSchema.parse(req.params);
  const validatedData = newsUpdateSchema.parse(req.body);
  const updatedBy = res.locals.payload?.userId || "system";
  const result = await updateNewsService(id, validatedData, updatedBy);
  ResponseSuccess(res, result);
}

async function deleteNews(req: Request, res: Response) {
  const { id } = idSchema.parse(req.params);
  const result = await deleteNewsService(id);
  ResponseSuccess(res, result);
}

export default newsController;
