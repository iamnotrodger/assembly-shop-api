import { Request, Response, NextFunction } from 'express';
import Team from '../../interface/Team';
import User from '../../interface/User';
import {
    insertMember,
    insertTeamAndJoin,
    selectTeamMembers,
    selectTeams,
} from '../../models/TeamModel';

export const getTeams = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { user_id } = req.user as User;
        const teams = await selectTeams(user_id);

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
        const { user_id } = req.user as User;
        const team: Team = req.body;
        team.administrator = user_id;

        await insertTeamAndJoin(team);

        res.status(200).json({
            message: 'Team Created',
            team,
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
        const { team_id, user_id } = req.body;

        await insertMember(team_id, user_id);

        res.status(200).json({
            message: `Ussr (${user_id}) has been added to Team (${team_id})`,
        });
    } catch (error) {
        next(error);
    }
};
