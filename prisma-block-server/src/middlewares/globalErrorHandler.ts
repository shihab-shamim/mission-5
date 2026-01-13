import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";

function globalErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let statusCode = 500;
  let errorMessage = "Internal Sever Error";
  let errorDetails = err;
  //  PrismaClientUnknownRequestError
  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    errorMessage = "You Provide incorrect filed type or missing fileds";
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      statusCode = 400;
      errorMessage =
        "An operation failed because it depends on one or more records that were required but not found. {cause}";
    } else if (err.code === "P2002") {
      statusCode = 400;
      errorMessage ="Unique constraint failed on the {constraint}"

       
    }
    else if (err.code === "P2003") {
      statusCode = 400;
      errorMessage ="Foreign key constraint failed on the field"


       
    }
  }
  else if( err instanceof Prisma.PrismaClientUnknownRequestError ){
    statusCode=500;
    errorMessage="indicates an issue where the Prisma query engine returns an error that does not have a specific, known Prisma error code"
  }
  else if( err instanceof Prisma.PrismaClientRustPanicError ){
    statusCode=500;
    errorMessage="PrismaClientRustPanicError"
  }
    else if( err instanceof Prisma.PrismaClientInitializationError ){
    statusCode=500;
    errorMessage="PrismaClientInitializationError"
    if(err.errorCode ==="P1000"){
          statusCode=401;
          errorMessage="Authentication Failed "
    }
  }

  res.status(statusCode);
  res.json({
    message: errorMessage,
    error: errorDetails,
  });
}

export default globalErrorHandler;
