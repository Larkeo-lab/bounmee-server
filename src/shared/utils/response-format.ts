import type { Response } from "express";

interface ResponseData {
  message?: string;
  code?: string;
  [key: string]: any;
}

const ResponseSuccess = (
  res: Response,
  data: ResponseData,
  statusCode = 200,
) => {
  const { message = "SUCCESS", code: responseCode, ...restData } = data;

  res.status(statusCode).json({
    code: responseCode || `POS-${statusCode}`,
    message,
    data: restData,
  });
};

const ResponsePaginationSuccess = (
  res: Response,
  data: any,
  page: number,
  limit: number,
  total: number,
  statusCode = 200,
  extraData?: any,
) => {
  const totalPages = Math.ceil(total / limit);

  res.status(statusCode).json({
    code: `POS-${statusCode}`,
    message: "SUCCESS",
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
    ...extraData,
  });
};

const ResponseManyDataSuccess = (
  res: Response,
  data: any,
  statusCode = 200,
) => {
  res.status(statusCode).json({
    code: `POS-${statusCode}`,
    message: "SUCCESS",
    data,
  });
};

export { ResponseSuccess, ResponsePaginationSuccess, ResponseManyDataSuccess };
