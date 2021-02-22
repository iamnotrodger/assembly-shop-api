import { NextFunction, Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import InvalidRequestException from '../../exception/InvalidRequestException';
import MemberRepository from '../../repository/MemberRepository';

export const getTeamMembers = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const teamID = Number(req.params.teamID);

        const memberRepository = getCustomRepository(MemberRepository);
        const members = await memberRepository.findByTeamId(teamID);

        res.status(200).json({ members });
    } catch (error) {
        next(error);
    }
};

export const addMember = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const teamID = Number(req.params.teamID);
        const { userID } = req.body;

        const memberRepository = getCustomRepository(MemberRepository);
        await memberRepository.createAndSave(teamID, userID);

        res.status(200).json({
            message: `User (${userID}) has been added to Team (${teamID})`,
        });
    } catch (error) {
        if (error.code == '23505' || error.code == '23503') {
            error = new InvalidRequestException(
                `Unable to add User (${req.body.userID}) to Team (${req.params.teamID}). This may be due to the User already being in the team or the User/Team does not exist.`,
            );
        }
        next(error);
    }
};

export const removeMember = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const teamID = Number(req.params.teamID);
        const userID = Number(req.params.userID);

        const memberRepository = getCustomRepository(MemberRepository);
        const { affected } = await memberRepository.delete({
            team: { teamID },
            user: { userID },
        });

        if (affected == 0) {
            throw new InvalidRequestException(
                `Invalid Request: User (${userID}) does not exist/is not a member of the Team.`,
            );
        }

        res.status(200).json({
            message: `User (${userID}) has been removed to Team (${teamID})`,
        });
    } catch (error) {
        next(error);
    }
};
