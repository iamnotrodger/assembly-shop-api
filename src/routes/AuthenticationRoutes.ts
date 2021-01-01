import { NextFunction, Router, Request, Response } from 'express';
import passport from 'passport';
import {
    assignRefreshToken,
    assignAccessToken,
    deaunthenticateRefreshToken,
    authenticateToken,
} from '../controllers/AuthenticationController';
import { authenticateMember } from '../controllers/AuthenticationController/AuthenticationController';

const AuthenticationRoutes = Router();

const redirectLogin = (req: Request, res: Response, next: NextFunction) => {
    const redirectURL = process.env.FRONT_END_URL! + '/auth';
    res.redirect(302, redirectURL);
};

/** Google Authentication */
AuthenticationRoutes.get(
    '/google',
    passport.authenticate('google', {
        session: false,
        scope: ['profile', 'email'],
    }),
);

/** Google Authentication Call Back */
AuthenticationRoutes.get(
    '/google/callback',
    passport.authenticate('google', { session: false }),
    assignRefreshToken,
    redirectLogin,
);

/** Request new access-token using refresh-token cookie */
AuthenticationRoutes.post('/token/refresh-token', assignAccessToken);

/** Request to clear refresh-token cookie */
AuthenticationRoutes.post('/token/logout', deaunthenticateRefreshToken);

AuthenticationRoutes.post('/isMember', authenticateToken, authenticateMember);

export default AuthenticationRoutes;
