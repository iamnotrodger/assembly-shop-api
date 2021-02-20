import { NextFunction, Request, Response } from 'express';
import User from '../../entities/User';
import InvalidRequestException from '../../exceptions/InvalidRequestException';
import NotAuthorizedException from '../../exceptions/NotAuthorizedException';
import Payload from '../../interface/Payload';
import { validateProjectAdmin } from '../../models/ProjectModel';
import {
    validateAdmin,
    validateMember,
    validateProjectMember,
} from '../../models/TeamModel';
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
        const { userID, email } = req.user as User;
        const payload: Payload = {
            userID,
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
        const { userID } = req.user as User;
        const team_id = req.body.team_id | (req.params.team_id as any);

        const isValid = await validateAdmin(userID, team_id);

        if (isValid) {
            next();
        } else {
            throw new NotAuthorizedException(401, 'Not Authorized Admin');
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
        const { userID } = req.user as User;
        const team_id = req.body.team_id | (req.params.team_id as any);

        const isValid = await validateMember(userID, team_id);

        if (isValid) {
            next();
        } else {
            throw new NotAuthorizedException(401, 'Not Authorized Member');
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
        const { userID } = req.body;
        const { project_id } = req.params;

        const isValid = await validateProjectMember(userID, project_id);

        if (isValid) {
            next();
        } else {
            throw new InvalidRequestException(
                `User (${userID}) not a member of Project (${project_id})`,
            );
        }
    } catch (error) {
        next(error);
    }
};

export const authenticateProjectAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { userID } = req.user as User;
        const project_id = req.body.project_id | (req.params.project_id as any);

        const isValid = await validateProjectAdmin(userID, project_id);

        if (isValid) {
            next();
        } else {
            throw new NotAuthorizedException(401, 'Not Authorized Admin');
        }
    } catch (error) {
        next(error);
    }
};

export const authenticateProjectMember = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { userID } = req.user as User;
        const project_id = req.body.project_id | (req.params.project_id as any);

        const isValid = await validateProjectMember(userID, project_id);

        if (isValid) {
            next();
        } else {
            throw new NotAuthorizedException(401, 'Not Authorized Member');
        }
    } catch (error) {
        next(error);
    }
};
