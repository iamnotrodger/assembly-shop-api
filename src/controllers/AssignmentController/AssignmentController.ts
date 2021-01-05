import { NextFunction, Request, Response } from 'express';
import InvalidRequestException from '../../exceptions/InvalidRequestException';
import Assignment from '../../interface/Assignment';
import {
    deleteAssignment,
    insertAssignment,
} from '../../models/AssignmentModel';

export const createAssignment = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const task_id = Number(req.params.task_id);
        const { user_id } = req.body;
        const assignment: Assignment = { task_id, user_id };

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
        const { assignment_id } = req.params;

        await deleteAssignment(assignment_id);

        res.status(200).json({
            message: `Assignment (${assignment_id}) Deleted`,
        });
    } catch (error) {
        next(error);
    }
};
