import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { NextFunction, Request, Response } from 'express';
import { JWTConfig } from '../../config';
import { HTTPSTATUS } from '@workspace/types/enums/common';
import { AuthenticatedRequest } from '../../common/interfaces';

import { cbError } from '../handler';
import { ERRORS } from '../constants';

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWTConfig.JWT_SECRET,
};

export function Authenticate(
  allowUnAuthenticated = false,
): (req: Request, res: Response, next: NextFunction) => void {
  passport.use(
    new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
      try {
        // TODO: Implement once the auth service is implemented
        // const authService = AuthService.getInstance();
        // const user: ICurrentUser | null = await authService.getCurrentUser(jwtPayload.sub);
        // if (!user) {
        //   return done(null, false, { message: 'User not found' });
        // }
        // return done(null, {
        //   id: user.id,
        //   roles: user.roles,
        //   email: user.email,
        // });
      } catch (error) {
        return done(error, false, { message: 'Error validating user' });
      }
    }),
  );
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    passport.authenticate('jwt', { session: false }, (err: any, user: any, info: any) => {
      if (user) {
        req.user = user;
        next();
        return;
      }
      if (allowUnAuthenticated) {
        next();
        return;
      }

      if (info) return cbError(res, HTTPSTATUS.UNAUTHORIZED, ERRORS.INVALID_TOKEN, info.message);

      if (err)
        return cbError(res, HTTPSTATUS.INTERNAL_SERVER_ERROR, ERRORS.INTERNAL_SERVER_ERROR, err);
    })(req, res, next);
  };
}
