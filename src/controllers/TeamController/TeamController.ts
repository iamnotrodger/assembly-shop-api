import { NextFunction, Request, Response } from 'express';
import User from '../../entities/User';
import InvalidRequestException from '../../exceptions/InvalidRequestException';
import Team from '../../interface/Team';
import {
    deleteMember,
    deleteTeam,
    insertMember,
    insertTeamAndJoin,
    selectTeamMembers,
    selectTeams,
    updateTeamName,
} from '../../models/TeamModel';

export const getTeams = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { userID } = req.user as User;
        const teams = await selectTeams(userID);

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
        const { team_id } = req.params;
        const members = await selectTeamMembers(team_id);

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
        const team: Team = req.body;
        team.administrator = userID;

        await insertTeamAndJoin(team);

        res.status(200).json({
            message: 'Team Created',
            team,
        });
    } catch (error) {
        next(error);
    }
};

export const removeTeam = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { team_id } = req.params;

        await deleteTeam(team_id);

        res.status(200).json({ message: `Team (${team_id}) Deleted` });
    } catch (error) {
        next(error);
    }
};

export const changeTeamName = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { team_id } = req.params;
        const { name } = req.body;

        await updateTeamName(team_id, name);

        res.status(200).json({
            message: `Updated Team (${team_id})'s name to '${name}'`,
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
        const { team_id } = req.params;
        const { userID } = req.body;

        await insertMember(team_id, userID);

        res.status(200).json({
            message: `User (${userID}) has been added to Team (${team_id})`,
        });
    } catch (error) {
        if (error instanceof InvalidRequestException)
            error.message = `Unable to add User (${req.body.userID}) to Team (${req.body.team_id}). This may be due to the User already being in the team or the User/Team does not exist.`;

        next(error);
    }
};

export const removeMember = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { team_id, userID } = req.params;

        await deleteMember(team_id, userID);

        res.status(200).json({
            message: `User (${userID}) has been removed to Team (${team_id})`,
        });
    } catch (error) {
        next(error);
    }
};
