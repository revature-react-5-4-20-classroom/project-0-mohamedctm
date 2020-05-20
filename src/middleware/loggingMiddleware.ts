import { Request, Response, NextFunction } from "express";
export function loggingMiddleware(req: Request, res: Response, next: NextFunction) {
  console.log(`url: ${req.url} (${req.method})`);
  next();
}

