import { Request, Response, NextFunction } from 'express';
import InvalidRequestException from '../../exceptions/InvalidRequestException';
import Task from '../../interface/Task';
import { insertTask } from '../../models/TaskModel';

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
