import { NextFunction, Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import {
    getTokenFromHeader,
    verifyAccessToken,
} from '../controller/AuthenticationController/utils';
import User from '../entity/User';
import InvalidRequestException from '../exception/InvalidRequestException';
import NotAuthorizedException from '../exception/NotAuthorizedException';
import LogRepository from '../repository/LogRepository';
import MemberRepository from '../repository/MemberRepository';
import TaskRepository from '../repository/TaskRepository';

//** Checks and validate access-token sent it with the request. Store User in req.user for the next middleware */
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

        const memberRepository = getCustomRepository(MemberRepository);
        const member = await memberRepository.findTeamAdmin(teamID, userID);

        if (member) {
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
        const { userID } = req.user as User;
        const teamID = req.body.teamID | (req.params.teamID as any);

        const memberRepository = getCustomRepository(MemberRepository);
        const member = await memberRepository.findOne({ teamID, userID });

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

        const memberRepository = getCustomRepository(MemberRepository);
        const member = await memberRepository.findProjectAdmin(
            projectID,
            userID,
        );

        if (member) {
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
        const member = await memberRepository.findOneProjectMemberByUser(
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
        const task = await taskRepository.findOne({ taskID });

        if (!task) throw new InvalidRequestException('Task does not exist');

        const { projectID, assigneeID } = task;

        if (userID === assigneeID) {
            next();
            return;
        }

        const memberRepository = getCustomRepository(MemberRepository);
        const member = await memberRepository.findProjectAdmin(
            projectID!,
            userID,
        );

        if (member) {
            next();
        } else {
            throw new NotAuthorizedException(403, 'Not Authorized Admin');
        }
    } catch (error) {
        next(error);
    }
};

//** Task request are authorized if the user making the request is either the assignee or a team admin    */
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

//** Log request are authorized if the user making the request is the assignee */
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

        if (!log) throw new NotAuthorizedException(404, 'Log does not exist');

        const { task } = log;

        if (task && task.assignee && task.assignee.userID == userID) {
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
