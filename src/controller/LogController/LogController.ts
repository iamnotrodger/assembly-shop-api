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
        const logs = await logRepository.find({ taskID });

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
        await logRepository.start(taskID, time);

        res.status(200).json({ message: 'Log Started' });
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

        const { total, log } = result!;
        res.status(200).json({
            message: 'Log Ended',
            total,
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
