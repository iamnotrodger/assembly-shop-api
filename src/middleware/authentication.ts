import { NextFunction, Request, Response } from 'express';
import { getManager } from 'typeorm';
import {
    getTokenFromHeader,
    verifyAccessToken,
} from '../controller/AuthenticationController/utils';
import Member from '../entity/Member';
import Team from '../entity/Team';
import User from '../entity/User';
import NotAuthorizedException from '../exception/NotAuthorizedException';

// Checks and validate access-token sent it with the request. Store User in req.user for the next middleware
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

export const authenticateAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { userID } = req.user as User;
        const teamID = req.body.teamID | (req.params.teamID as any);

        const teamRepository = getManager().getRepository(Team);
        const team = await teamRepository.findOne({
            where: { teamID: teamID, administrator: userID },
        });

        if (team) {
            next();
        } else {
            throw new NotAuthorizedException(403, 'Not Authorized Admin');
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
        const teamID = req.body.teamID | (req.params.teamID as any);

        const memberRepository = getManager().getRepository(Member);
        const member = await memberRepository.findOne({
            where: { team: { teamID }, user: req.user },
        });

        if (member) {
            next();
        } else {
            throw new NotAuthorizedException(403, 'Not Authorized Member');
        }
    } catch (error) {
        next(error);
    }
};
