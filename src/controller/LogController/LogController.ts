import { NextFunction, Request, Response } from 'express';
import { getCustomRepository, getManager } from 'typeorm';
import Task from '../../entity/Task';
import InvalidRequestException from '../../exception/InvalidRequestException';
import LogRepository from '../../repository/LogRepository';

export const getLogs = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const taskID = Number(req.params.taskID);

        const logRepository = getCustomRepository(LogRepository);
        const logs = await logRepository.find({ taskID });

        res.status(200).json({ logs });
    } catch (error) {
        next(error);
    }
};

export const startLog = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const taskID = Number(req.params.taskID);

        const logRepository = getCustomRepository(LogRepository);
        const log = await logRepository.start(taskID);

        res.status(200).json({
            message: 'Log Started',
            log,
        });
    } catch (error) {
        next(error);
    }
};

export const stopLog = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const logID = Number(req.params.logID);

        const logRepository = getCustomRepository(LogRepository);
        const log = await logRepository.stop(logID);

        if (!log) {
            throw new InvalidRequestException(
                `Invalid Request: Log (${logID}) does not exist.`,
            );
        }

        res.status(200).json({
            message: 'Log Ended',
            log,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteLog = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const logID = Number(req.params.logID);

        const logRepository = getCustomRepository(LogRepository);
        const { affected } = await logRepository.deleteAndDecrementTaskTime(
            logID,
        );

        if (affected == 0) {
            throw new InvalidRequestException(
                `Invalid Request: Log (${logID}) does not exist.`,
            );
        }

        res.status(200).json({
            message: `Deleted Log (${logID})`,
        });
    } catch (error) {
        next(error);
    }
};

export const validateTaskBelongsToUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const taskID = Number(req.params.taskID);

        const taskRepository = getManager().getRepository(Task);
        const task = await taskRepository.findOne({
            where: { taskID, assignee: req.user },
        });

        if (task) {
            next();
        } else {
            throw new InvalidRequestException(
                `Invalid Request: Task (${taskID}) does not belong to User.`,
            );
        }
    } catch (error) {
        next(error);
    }
};
