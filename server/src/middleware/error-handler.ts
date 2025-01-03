import { Request, Response, NextFunction } from "express";
import {CustomError} from '../errors/custom-error'
import {AppError} from '../errors/app-error'


export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {


  if (err instanceof CustomError || err instanceof AppError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }
  console.log(err)
  return res
    .status(400)
    .send({ errors: [{ message: "Something Went Wrong" }] });
};
