import { Request, Response, NextFunction } from 'express';
import {
    createAccessToken,
    getTokenFromHeader,
    createRefreshToken,
    verifyRefreshToken,
    verifyAccessToken,
} from './utils';
import User from '../../interface/User';
import Payload from '../../interface/Payload';
import NotAuthorizedException from '../../exceptions/NotAuthorizedException';
import {
    validateAdminByProject,
    validateAdminByTeam,
} from '../../models/UserModel';

// MIDDLEWARE. Checks and validate access-token sent it with the request. Store User in req.user for the next middleware
export const authenticateToken = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const accessToken = getTokenFromHeader(req);
        const accessTokenPayload = verifyAccessToken(accessToken);
        //creates Payload object without Property exp and iat
        const { exp, iat, ...payload } = accessTokenPayload;
        req.user = payload;
        next();
    } catch (err) {
        next(err);
    }
};

//Used on user login.
export const assignRefreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { user_id, email } = req.user as User;
        const payload: Payload = {
            user_id,
            email,
        };

        const refreshToken = createRefreshToken(payload);
        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
        });

        //A redirect must be handled on the next middleware
        next();
    } catch (err) {
        next(err);
    }
};

//Used on user logout
export const deaunthenticateRefreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const refreshToken = req.cookies.refresh_token;
        if (!refreshToken) {
            throw new NotAuthorizedException();
        }

        verifyRefreshToken(refreshToken);

        res.clearCookie('refresh_token');
        res.status(200).send('Token Unauthenticated');
    } catch (err) {
        next(err);
    }
};

//The request must contain a refresh-token cookie to assign an access-token
export const assignAccessToken = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const refreshToken = req.cookies.refresh_token;
        if (!refreshToken) {
            throw new NotAuthorizedException();
        }

        const refreshPayload = verifyRefreshToken(refreshToken);

        //creates Payload object without Property exp and iat, since this will cause an error when used in JWT.sign
        const { exp, iat, ...payload } = refreshPayload;
        const accessToken = createAccessToken(payload);
        res.status(200).json({ accessToken });
    } catch (err) {
        next(err);
    }
};

export const authenticateAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { user_id } = req.user as User;
        const { team_id, project_id } = req.body;

        const isValid =
            team_id == null
                ? await validateAdminByProject(user_id, project_id)
                : await validateAdminByTeam(user_id, team_id);

        if (isValid) {
            next();
        } else {
            throw new NotAuthorizedException(
                401,
                'Not Authorized Administrator',
            );
        }
    } catch (error) {
        next(error);
    }
};
