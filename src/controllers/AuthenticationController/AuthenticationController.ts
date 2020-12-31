import { Request, Response, NextFunction } from 'express';
import {
    redisSetAsync,
    redisGetAsync,
    redisDelAsync,
} from '../../config/redisConfig';
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

        //This scenario would only come up if a user signs in on multiples devices
        let refreshToken = await redisGetAsync(user_id.toString());
        if (!refreshToken) {
            refreshToken = createRefreshToken(payload);
            const yearInSec = 60 * 60 * 365;
            await redisSetAsync(user_id.toString(), refreshToken, yearInSec);
        }

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

        const payload = verifyRefreshToken(refreshToken);
        //Delete stored refresh-token
        await redisDelAsync(payload.user_id.toString());

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
        const storedRefreshToken = await redisGetAsync(
            refreshPayload.user_id.toString(),
        );
        if (!storedRefreshToken || storedRefreshToken !== refreshToken) {
            throw new NotAuthorizedException(403, 'Invalid Refresh Token');
        }

        //creates Payload object without Property exp and iat, since this will cause an error when used in JWT.sign
        const { exp, iat, ...payload } = refreshPayload;
        const accessToken = createAccessToken(payload);
        res.status(200).json({ accessToken });
    } catch (err) {
        next(err);
    }
};
