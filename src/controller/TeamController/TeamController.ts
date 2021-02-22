import { NextFunction, Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import Team from '../../entity/Team';
import User from '../../entity/User';
import InvalidRequestException from '../../exception/InvalidRequestException';
import MemberRepository from '../../repository/MemberRepository';
import TeamRepository from '../../repository/TeamRepository';

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
        team.administratorID = userID;
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
        const { affected } = await teamRepository.delete(teamID);

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
        const { affected } = await teamRepository.update(teamID, { name });

        if (affected == 0) {
            throw new InvalidRequestException(
                `Invalid Request: Team (${teamID}) does not exist.`,
            );
        }

        res.status(200).json({
            message: `Updated Team (${teamID})'s name to '${name}'`,
        });
    } catch (error) {
        next(error);
    }
};
