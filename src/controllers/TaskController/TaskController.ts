import { NextFunction, Request, Response } from 'express';
import InvalidRequestException from '../../exceptions/InvalidRequestException';
import { ASSIGNMENT_STATUS } from '../../interface/Assignment';
import Task from '../../interface/Task';
import {
    deleteTask,
    insertTask,
    selectTask,
    updateTaskInfo,
} from '../../models/TaskModel';

export const getTasks = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { project_id } = req.params;
        const status = req.query.status as ASSIGNMENT_STATUS;

        const tasks: Task[] = await selectTask(project_id, status);

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
        const { project_id } = req.params;
        const task: Task = req.body;
        task.project_id = Number(project_id);

        task.task_id = await insertTask(task);

        res.status(200).json({
            message: 'Task Created',
            task,
        });
    } catch (error) {
        if (error instanceof InvalidRequestException)
            error.message = `Invalid Request: Project (${req.params.project_id}) does not exist.`;
        next(error);
    }
};

export const removeTask = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { task_id } = req.params;

        await deleteTask(task_id);

        res.status(200).json({ message: 'Task Deleted' });
    } catch (error) {
        next(error);
    }
};

export const changeTaskInfo = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { task_id } = req.params;
        const field = req.query.field as string;
        const { newValue } = req.body;

        await updateTaskInfo(task_id, field, newValue);

        res.status(200).json({
            message: `Updated Task ${field} to '${newValue}'`,
        });
    } catch (error) {
        next(error);
    }
};
