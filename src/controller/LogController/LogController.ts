import { NextFunction, Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
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
        const logs = await logRepository.find({
            where: { taskID },
            order: { logID: 'DESC' },
        });

        res.status(200).json(logs);
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
        const { time } = req.body;

        const logRepository = getCustomRepository(LogRepository);
        const log = await logRepository.start(taskID, time);

        res.status(200).json({ message: 'Log Started', log });
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
        const taskID = Number(req.params.taskID);
        const { time } = req.body;

        const logRepository = getCustomRepository(LogRepository);
        const result = await logRepository.stop(taskID, new Date(time));

        if (!result) {
            throw new InvalidRequestException(
                `Invalid Request: Task (${taskID}) does not exist or task does not have an active log.`,
            );
        }

        res.status(200).json({
            message: 'Log Ended',
            ...result,
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
        const {
            successful,
            totalTime,
        } = await logRepository.deleteAndDecrementTaskTime(logID);

        if (!successful) {
            throw new InvalidRequestException(
                `Invalid Request: Log (${logID}) does not exist.`,
            );
        }

        res.status(200).json({
            message: `Deleted Log (${logID})`,
            totalTime,
        });
    } catch (error) {
        next(error);
    }
};
