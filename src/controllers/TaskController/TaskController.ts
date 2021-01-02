import { NextFunction, Request, Response } from 'express';
import InvalidRequestException from '../../exceptions/InvalidRequestException';
import Task from '../../interface/Task';
import { deleteTask, insertTask, updateTaskInfo } from '../../models/TaskModel';

export const createTask = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const task: Task = req.body;

        task.task_id = await insertTask(task);

        res.status(200).json({
            message: 'Task Created',
            task,
        });
    } catch (error) {
        if (error instanceof InvalidRequestException)
            error.message = `Invalid Request: Project (${req.body.project_id}) does not exist.`;
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
