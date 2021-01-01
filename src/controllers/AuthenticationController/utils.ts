/** @internal */ /** */
import { Request } from 'express';
import { sign, verify } from 'jsonwebtoken';
import Payload from '../../interface/Payload';
import NotAuthorizedException from '../../exceptions/NotAuthorizedException';
import AuthenticationTokenMissingException from '../../exceptions/AuthenticationTokenMissingException';

export const getTokenFromHeader = (req: Request) => {
    const { authorization } = req.headers;
    if (!authorization) {
        throw new AuthenticationTokenMissingException();
    }
    //grabs the token from the authorization header
    return authorization.split(' ')[1];
};

/** Create Access-token with an expiration of 5 minutes */
export const createAccessToken = (payload: Payload) => {
    return sign(payload, process.env.ACCESS_TOKEN_SECRET!, {
        expiresIn: 60 * 5,
    });
};

export const createRefreshToken = (payload: Payload) => {
    return sign(payload, process.env.REFRESH_TOKEN_SECRET!, {
        expiresIn: 60 * 60 * 24 * 365,
    });
};

export const verifyAccessToken = (token: string) => {
    const payload = verify(
        token,
        process.env.ACCESS_TOKEN_SECRET!,
        (err, result) => {
            if (err) {
                throw new NotAuthorizedException(
                    401,
                    'Access-Token Invalid: ' + err.message,
                );
            }
            return result;
        },
    ) as any;
    return payload as Payload;
};

export const verifyRefreshToken = (token: string) => {
    const payload = verify(
        token,
        process.env.REFRESH_TOKEN_SECRET!,
        (err, result) => {
            if (err) {
                throw new NotAuthorizedException(
                    403,
                    'Refresh-Token Invalid: ' + err.message,
                );
            }
            return result;
        },
    ) as any;
    return payload as Payload;
};
