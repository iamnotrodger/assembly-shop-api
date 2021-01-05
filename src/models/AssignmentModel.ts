import { query } from '../config/postgresConfig';
import InvalidRequestException from '../exceptions/InvalidRequestException';
import Assignment from '../interface/Assignment';

export const insertAssignment = async (assignment: Assignment) => {
    const queryString =
        'INSERT INTO assignment (task_id, user_id) VALUES ($1, $2) RETURNING assignment_id;';
    const queryParams: any[] = [assignment.task_id, assignment.user_id];

    const { rows } = await query(queryString, queryParams);
    const { assignment_id } = rows[0];
    return assignment_id as number;
};

export const deleteAssignment = async (assignment_id: string | number) => {
    const queryString = 'DELETE FROM assignment WHERE assignment_id = $1;';
    const queryParams: any[] = [assignment_id];

    const { rowCount } = await query(queryString, queryParams);
    if (rowCount === 0)
        throw new InvalidRequestException(
            `Invalid Request: Unable to delete Assignment, Assignment (${assignment_id})  does not exist.`,
        );
};
