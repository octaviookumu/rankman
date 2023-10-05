import { ForbiddenException, Injectable } from '@nestjs/common';
import { CanActivate, Logger, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { RequestWithAuth } from '../polls/types';

@Injectable()
export class PollsAuthGuard implements CanActivate {
  private readonly logger = new Logger(PollsAuthGuard.name);
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: RequestWithAuth = context.switchToHttp().getRequest();

    this.logger.debug(`Checking for auth token on request body`, request.body);
    const { accessToken } = request.body;

    try {
      const payload = this.jwtService.verify(accessToken);
      // verifies token and turns it into JS object 
      // add details to the request
      request.userID = payload.sub;
      request.pollID = payload.pollID;
      request.name = payload.name;
      return true;
    } catch {
      throw new ForbiddenException('Invalid Authorization Token');
    }
  }
}
