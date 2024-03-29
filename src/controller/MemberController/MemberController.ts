import { NextFunction, Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import Member from '../../entity/Member';
import User from '../../entity/User';
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

        res.status(200).json(members);
    } catch (error) {
        next(error);
    }
};

export const getProjectMembers = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const projectID = Number(req.params.projectID);

        const memberRepository = getCustomRepository(MemberRepository);
        const members = await memberRepository.findByProjectId(projectID);

        res.status(200).json(members);
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
        const member = new Member();
        member.teamID = Number(req.params.teamID);
        member.userID = Number(req.params.userID);
        member.admin = false;

        const memberRepository = getCustomRepository(MemberRepository);
        await memberRepository.add(member);

        res.status(200).json(member);
    } catch (error) {
        if (error.code == '23505' || error.code == '23503') {
            error = new InvalidRequestException(
                `Unable to add User (${req.params.userID}) to Team (${req.params.teamID}). This may be due to the User already being in the team or the User/Team does not exist.`,
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
        const { teamID, userID } = req.params;

        const memberRepository = getCustomRepository(MemberRepository);
        const { affected } = await memberRepository.subtract(teamID, userID);

        if (affected == 0) {
            throw new InvalidRequestException(
                `Invalid Request: User (${userID}) does not exist or is not a member of the Team.`,
            );
        }

        res.status(200).json({
            message: `User (${userID}) has been removed to Team (${teamID})`,
        });
    } catch (error) {
        next(error);
    }
};

export const quitTeam = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const teamID = Number(req.params.teamID);
        const { userID } = req.user as User;

        const memberRepository = getCustomRepository(MemberRepository);
        const { affected } = await memberRepository.subtract(teamID, userID);

        if (affected == 0) {
            throw new InvalidRequestException(
                `Invalid Request: User (${userID}) does not exist or is not a member of the Team.`,
            );
        }

        res.status(200).json({
            message: `User (${userID}) has been removed to Team (${teamID})`,
        });
    } catch (error) {
        next(error);
    }
};
