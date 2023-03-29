import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP')
  use(req: Request, res: Response, next: NextFunction) {
    this.logger.log(`Logging HTTP request ${req.method} ${req.baseUrl} ${res.statusCode}`)
    this.logger.log(`HTTP request headers: ${req.rawHeaders}`)
    next()
  }
}
