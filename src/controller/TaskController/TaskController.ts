import { NextFunction, Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import Task from '../../entity/Task';
import InvalidRequestException from '../../exception/InvalidRequestException';
import MemberRepository from '../../repository/MemberRepository';
import TaskRepository from '../../repository/TaskRepository';

export const getTasks = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const projectID = Number(req.params.projectID);

        const taskRepository = getCustomRepository(TaskRepository);
        const tasks = await taskRepository.find({
            relations: ['assignee', 'assignee.user', 'activeLog'],
            where: { project: { projectID } },
            order: { taskID: 'DESC' },
        });

        res.status(200).json(tasks);
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
        const { projectID, title, description, assignee } = req.body;

        const task = new Task();
        task.title = title;
        task.description = description;
        task.project = { projectID };
        task.assignee = assignee;
        task.completed = false;
        task.totalTime = 0;

        const taskRepository = getCustomRepository(TaskRepository);
        await taskRepository.save(task);

        res.status(200).json(task);
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

        const taskRepository = getCustomRepository(TaskRepository);
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
        const { value } = req.body;

        const updateInfo =
            field === 'title' ? { title: value } : { description: value };

        const taskRepository = getCustomRepository(TaskRepository);
        const { affected } = await taskRepository.update(taskID, updateInfo);

        if (affected == 0) {
            throw new InvalidRequestException(
                `Invalid Request: Task (${taskID}) does not exist.`,
            );
        }

        res.status(200).json({
            message: `Updated Task ${field} to '${value}'`,
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
        const assignee = req.body;

        const taskRepository = getCustomRepository(TaskRepository);
        const { affected } = await taskRepository.update(taskID, {
            assignee,
        });

        if (affected == 0) {
            throw new InvalidRequestException(
                `Invalid Request: Task (${taskID}) does not exist.`,
            );
        }

        res.status(200).json({
            message: `Task (${taskID}) assigned to Member (${assignee.memberID})`,
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

export const setTaskCompleted = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const taskID = Number(req.params.taskID);

        const taskRepository = getCustomRepository(TaskRepository);
        const result = await taskRepository.completed(taskID);

        if (!result) {
            throw new InvalidRequestException(
                `Invalid Request: Task (${taskID}) does not exist.`,
            );
        }

        res.status(200).json({
            message: `Task (${taskID}) set to completed.`,
            ...result,
        });
    } catch (error) {
        next(error);
    }
};

export const setTaskIncomplete = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const taskID = Number(req.params.taskID);

        const taskRepository = getCustomRepository(TaskRepository);
        const { affected } = await taskRepository.update(taskID, {
            completed: false,
        });

        if (affected == 0) {
            throw new InvalidRequestException(
                `Invalid Request: Task (${taskID}) does not exist.`,
            );
        }

        res.status(200).json({
            message: `Task (${taskID}) set to incomplete.`,
        });
    } catch (error) {
        next(error);
    }
};

export const validateAssignee = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const taskID = Number(req.params.taskID);
        const { memberID } = req.body;

        const taskRepository = getCustomRepository(TaskRepository);
        const task = await taskRepository.findTaskByMember(taskID, memberID);

        if (task) {
            next();
        } else {
            throw new InvalidRequestException(
                `Invalid Request: Unable to assign Task. User with memberID ${memberID} is not a member of the Project.`,
            );
        }
    } catch (error) {
        next(error);
    }
};

export const validateAssigneeOnCreate = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { assignee, projectID } = req.body;

        if (!assignee) {
            next();
            return;
        }

        const { memberID } = assignee;

        const memberRepository = getCustomRepository(MemberRepository);
        const member = await memberRepository.findOneProjectMember(
            projectID,
            memberID,
        );

        if (member) {
            next();
        } else {
            throw new InvalidRequestException(
                'Invalid Request: Task Assignee is not a member of the project.',
            );
        }
    } catch (error) {
        next(error);
    }
};
