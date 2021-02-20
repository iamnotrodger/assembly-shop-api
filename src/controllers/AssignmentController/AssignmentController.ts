import { NextFunction, Request, Response } from 'express';
import User from '../../entities/User';
import InvalidRequestException from '../../exceptions/InvalidRequestException';
import Assignment, { ASSIGNMENT_STATUS } from '../../interface/Assignment';
import {
    deleteAssignment,
    insertAssignment,
    updateAssignment,
} from '../../models/AssignmentModel';

export const createAssignment = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const task_id = Number(req.params.task_id);
        const { userID } = req.body;
        const assignment: Assignment = { task_id, user: userID };

        assignment.assignment_id = await insertAssignment(assignment);

        res.status(200).json({
            message: 'Assignment Created',
            assignment,
        });
    } catch (error) {
        if (error instanceof InvalidRequestException)
            error.message = `Invalid Request: Task (${req.params.task_id}) may be already be assigned to an existing Assignment or Task does not exist`;
        next(error);
    }
};

export const removeAssignment = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { task_id } = req.params;

        await deleteAssignment(task_id);

        res.status(200).json({
            message: 'Assignment Deleted',
        });
    } catch (error) {
        next(error);
    }
};

export const updateAssignmentStatus = (status: ASSIGNMENT_STATUS) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { task_id } = req.params;
            const { userID } = req.user as User;

            await updateAssignment(task_id, userID, status);

            res.status(200).json({ message: `Task (${task_id}) ${status}` });
        } catch (error) {
            next(error);
        }
    };
};
