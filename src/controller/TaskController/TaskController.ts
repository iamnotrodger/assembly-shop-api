import { NextFunction, Request, Response } from 'express';
import { getManager } from 'typeorm';
import Member from '../../entity/Member';
import Task from '../../entity/Task';
import InvalidRequestException from '../../exception/InvalidRequestException';
import NotAuthorizedException from '../../exception/NotAuthorizedException';

export const getTasks = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const projectID = Number(req.params.projectID);

        const taskRepository = getManager().getRepository(Task);
        const tasks = await taskRepository.find({
            relations: ['assignee'],
            where: { project: { projectID } },
        });

        res.status(200).json({
            tasks,
        });
    } catch (error) {
        next(error);
    }
};

export const createTask = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const projectID = Number(req.params.projectID);
        const { title, description, assignee } = req.body;

        const task = new Task();
        task.title = title;
        task.description = description;
        task.project = { projectID };
        task.assignee = assignee;
        task.finished = false;
        task.totalTime = 0;

        const taskRepository = getManager().getRepository(Task);
        await taskRepository.save(task);

        res.status(200).json({
            message: 'Task Created',
            task,
        });
    } catch (error) {
        if (error.code == '23503') {
            error = new InvalidRequestException(
                `Invalid Request: Project (${req.params.projectID}) does not exist.`,
            );
        }
        next(error);
    }
};

export const deleteTask = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const taskID = req.params.taskID;

        const taskRepository = getManager().getRepository(Task);
        const { affected } = await taskRepository.delete(taskID);

        if (affected == 0) {
            throw new InvalidRequestException(
                `Invalid Request: Task (${taskID}) does not exist.`,
            );
        }

        res.status(200).json({ message: 'Task Deleted' });
    } catch (error) {
        next(error);
    }
};

export const updateTaskInfo = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const taskID = Number(req.params.taskID);
        const field = req.query.field;
        const { newValue } = req.body;

        const updateInfo =
            field === 'title' ? { title: newValue } : { description: newValue };

        const taskRepository = getManager().getRepository(Task);
        const { affected } = await taskRepository.update(taskID, updateInfo);

        if (affected == 0) {
            throw new InvalidRequestException(
                `Invalid Request: Task (${taskID}) does not exist.`,
            );
        }

        res.status(200).json({
            message: `Updated Task ${field} to '${newValue}'`,
        });
    } catch (error) {
        next(error);
    }
};

export const assignTask = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const taskID = Number(req.params.taskID);
        const { assignee } = req.body;

        const taskRepository = getManager().getRepository(Task);
        const { affected } = await taskRepository.update(taskID, { assignee });

        if (affected == 0) {
            throw new InvalidRequestException(
                `Invalid Request: Task (${taskID}) does not exist.`,
            );
        }

        res.status(200).json({
            message: `Task (${taskID}) assigned to User (${assignee.userID})`,
        });
    } catch (error) {
        if (error.code == '23503') {
            error = new InvalidRequestException(
                `Invalid Request: User (${req.body.assignee.userID}) does not exist.`,
            );
        }
        next(error);
    }
};

export const verifyAssigneeIsTeamMember = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const teamID = req.body.teamID | (req.params.teamID as any);
        const { assignee } = req.body;

        if (!assignee) {
            next();
        }

        const memberRepository = getManager().getRepository(Member);
        const member = await memberRepository.findOne({
            where: { team: { teamID }, user: assignee },
        });

        if (member) {
            next();
        } else {
            throw new InvalidRequestException(
                `Invalid Request: User (${assignee.userID}) is not a part of Team (${teamID}).`,
            );
        }
    } catch (error) {
        next(error);
    }
};
