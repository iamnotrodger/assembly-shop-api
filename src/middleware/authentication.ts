import { NextFunction, Request, Response } from 'express';
import { getCustomRepository, getManager } from 'typeorm';
import {
    getTokenFromHeader,
    verifyAccessToken,
} from '../controller/AuthenticationController/utils';
import Team from '../entity/Team';
import User from '../entity/User';
import InvalidRequestException from '../exception/InvalidRequestException';
import NotAuthorizedException from '../exception/NotAuthorizedException';
import LogRepository from '../repository/LogRepository';
import MemberRepository from '../repository/MemberRepository';
import ProjectRepository from '../repository/ProjectRepository';
import TaskRepository from '../repository/TaskRepository';

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

export const authenticateTeamAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { userID } = req.user as User;
        const teamID = req.body.teamID | (req.params.teamID as any);

        const teamRepository = getManager().getRepository(Team);
        const team = await teamRepository.findOne({
            where: { teamID: teamID, administratorID: userID },
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

export const authenticateTeamMember = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const teamID = req.body.teamID | (req.params.teamID as any);

        const memberRepository = getCustomRepository(MemberRepository);
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

export const authenticateProjectAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { userID } = req.user as User;
        const projectID = req.body.projectID | (req.params.projectID as any);

        const projectRepository = getCustomRepository(ProjectRepository);
        const project = await projectRepository.findProjectByAdminId(
            projectID,
            userID,
        );

        if (project) {
            next();
        } else {
            throw new NotAuthorizedException(403, 'Not Authorized Admin');
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
        const projectID = req.body.projectID | (req.params.projectID as any);

        const memberRepository = getCustomRepository(MemberRepository);
        const member = await memberRepository.findOneProjectMember(
            projectID,
            userID,
        );

        if (member) {
            next();
        } else {
            throw new NotAuthorizedException(403, 'Not Authorized Member');
        }
    } catch (error) {
        next(error);
    }
};

//** Authenticate if the task belongs to the user or the User is a Project Admin */
export const authenticateTaskAction = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const taskID = Number(req.params.taskID);
        const { userID } = req.user as User;

        const taskRepository = getCustomRepository(TaskRepository);
        const task = await taskRepository.findAssigneeOrAdmin(taskID, userID);

        if (task) {
            next();
            return;
        } else {
            throw new NotAuthorizedException(
                403,
                'Not Authorized: Task does belong to user',
            );
        }
    } catch (error) {
        next(error);
    }
};

export const authenticateTaskMember = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const taskID = Number(req.params.taskID);
        const { userID } = req.user as User;

        const taskRepository = getCustomRepository(TaskRepository);
        const task = taskRepository.findTaskByMember(taskID, userID);

        if (task) {
            next();
            return;
        } else {
            throw new NotAuthorizedException(403, 'Not Authorized Member');
        }
    } catch (error) {
        next(error);
    }
};

export const authenticateLogAction = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const logID = Number(req.params.logID);
        const { userID } = req.user as User;

        const logRepository = getCustomRepository(LogRepository);
        const log = await logRepository.findTask(logID);

        if (!log) throw new InvalidRequestException('Log does not exist');

        const { task } = log;

        if (task!.assigneeID === userID) {
            next();
            return;
        } else {
            throw new NotAuthorizedException(
                403,
                'Not Authorized Action: Task does not belong to user.',
            );
        }
    } catch (error) {
        next(error);
    }
};
