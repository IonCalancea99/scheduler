import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { Request } from "express";

@Injectable()
export class AppGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const headers = context.switchToHttp().getRequest<Request>().headers;
    const schedulerHeader = headers["x-scheduler-header"];
    console.log(schedulerHeader, "schedulerHeader");
    return schedulerHeader === "secret!";
  }
}
