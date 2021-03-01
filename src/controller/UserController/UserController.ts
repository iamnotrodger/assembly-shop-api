import { NextFunction, Request, Response } from 'express';
import { getManager } from 'typeorm';
import User from '../../entity/User';

export const getUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const userRepository = getManager().getRepository(User);
        const user = await userRepository.findOne(req.user);

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

export const getUsersByEmail = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { userID } = req.user as User;
        const email = req.query.email as string;

        const userRepository = getManager().getRepository(User);
        const users = await userRepository
            .createQueryBuilder()
            .where('email like :email AND user_id <> :userID', {
                email: `%${email}%`,
                userID,
            })
            .getMany();

        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};
