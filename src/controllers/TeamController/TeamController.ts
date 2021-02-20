import { NextFunction, Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import Team from '../../entities/Team';
import User from '../../entities/User';
import InvalidRequestException from '../../exceptions/InvalidRequestException';
import MemberRepository from '../../repositories/MemberRepository';
import TeamRepository from '../../repositories/TeamRepository';

export const getTeams = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { userID } = req.user as User;

        const memberRepository = getCustomRepository(MemberRepository);
        const teams = await memberRepository.findTeams(userID);

        res.status(200).json({ teams });
    } catch (error) {
        next(error);
    }
};

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

export const createTeam = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { userID } = req.user as User;
        const { name } = req.body;

        const team = new Team();
        team.name = name;
        team.administrator = { userID };
        team.numMembers = 1;

        const teamRepository = getCustomRepository(TeamRepository);
        await teamRepository.createAndJoin(team);

        res.status(200).json({
            message: 'Team Created',
            team,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteTeam = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const teamID = Number(req.params.teamID);

        const teamRepository = getCustomRepository(TeamRepository);
        const { affected } = await teamRepository.delete({ teamID });

        if (affected == 0) {
            throw new InvalidRequestException(
                `Invalid Request: Team (${teamID}) does not exist.`,
            );
        }

        res.status(200).json({ message: `Team (${teamID}) Deleted` });
    } catch (error) {
        next(error);
    }
};

export const updateTeamName = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const teamID = Number(req.params.teamID);
        const { name } = req.body;

        const teamRepository = getCustomRepository(TeamRepository);
        await teamRepository.updateTeamName(teamID, name);

        res.status(200).json({
            message: `Updated Team (${teamID})'s name to '${name}'`,
        });
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
