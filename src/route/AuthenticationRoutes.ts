import { Request, Response, Router } from 'express';
import passport from 'passport';
import {
    assignAccessToken,
    assignRefreshToken,
    deaunthenticateRefreshToken,
} from '../controller/AuthenticationController';

const AuthenticationRoutes = Router();

const redirectLogin = (req: Request, res: Response) => {
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

/** Facebook Authentication */
AuthenticationRoutes.get(
    '/facebook',
    passport.authenticate('facebook', {
        session: false,
        scope: ['profile', 'email'],
    }),
);

/** Facebook Authentication Call Back */
AuthenticationRoutes.get(
    '/facebook/callback',
    passport.authenticate('facebook', { session: false }),
    assignRefreshToken,
    redirectLogin,
);

/** Request new access-token using refresh-token cookie */
AuthenticationRoutes.post('/token/refresh-token', assignAccessToken);

/** Request to logout and clear refresh-token cookie */
AuthenticationRoutes.post('/logout', deaunthenticateRefreshToken);

export default AuthenticationRoutes;
