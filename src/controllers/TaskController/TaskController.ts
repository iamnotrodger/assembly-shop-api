import { Request, Response, NextFunction } from 'express';
import InvalidRequestException from '../../exceptions/InvalidRequestException';
import Task from '../../interface/Task';
import {
    deleteTask,
    insertTask,
    updateTaskTitle,
} from '../../models/TaskModel';

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

export const changeTaskTitle = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { task_id } = req.params;
        const { title } = req.body;

        await updateTaskTitle(task_id, title);

        res.status(200).json({ message: `Updated Task title to '${title}'` });
    } catch (error) {
        next(error);
    }
};
