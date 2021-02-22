import { NextFunction, Request, Response } from 'express';
import User from '../../entity/User';
import NotAuthorizedException from '../../exception/NotAuthorizedException';
import Payload from '../../interface/Payload';
import {
    createAccessToken,
    createRefreshToken,
    verifyRefreshToken,
} from './utils';

//Used on user login.
export const assignRefreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { userID, email } = req.user as User;
        const payload: Payload = {
            userID,
            email: email!,
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
