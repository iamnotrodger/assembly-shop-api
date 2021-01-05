import { NextFunction, Request, Response } from 'express';
import InvalidRequestException from '../../exceptions/InvalidRequestException';
import NotAuthorizedException from '../../exceptions/NotAuthorizedException';
import Payload from '../../interface/Payload';
import User from '../../interface/User';
import { validateAdmin, validateMember } from '../../models/UserModel';
import {
    createAccessToken,
    createRefreshToken,
    getTokenFromHeader,
    verifyAccessToken,
    verifyRefreshToken,
} from './utils';

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
        const team_id = req.body.team_id | (req.params.team_id as any);

        const { user_id } = req.user as User;

        const isValid = await validateAdmin(user_id, team_id);

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

export const authenticateMember = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const team_id = req.body.team_id | (req.params.team_id as any);
        const { user_id } = req.user as User;

        const isValid = await validateMember(user_id, team_id);

        if (isValid) {
            next();
        } else {
            throw new NotAuthorizedException(
                401,
                `Not Authorized Member of Team (${team_id})`,
            );
        }
    } catch (error) {
        next(error);
    }
};

export const authenticateMemberByRequest = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { user_id } = req.body;
        const { team_id } = req.params;

        const isValid = await validateMember(user_id, team_id);

        if (isValid) {
            next();
        } else {
            throw new InvalidRequestException(
                `User (${user_id}) not a member of Team (${team_id})`,
            );
        }
    } catch (error) {
        next(error);
    }
};
