import { query } from '../config/postgresConfig';
import InvalidRequestException from '../exceptions/InvalidRequestException';
import Assignment, { ASSIGNMENT_STATUS } from '../interface/Assignment';

export const insertAssignment = async (assignment: Assignment) => {
    const queryString =
        'INSERT INTO assignment (task_id, user_id) VALUES ($1, $2) RETURNING assignment_id;';
    const queryParams: any[] = [assignment.task_id, assignment.user_id];

    const { rows } = await query(queryString, queryParams);
    const { assignment_id } = rows[0];
    return assignment_id as number;
};

export const deleteAssignment = async (task_id: string | number) => {
    const queryString = 'DELETE FROM assignment WHERE task_id = $1;';
    const queryParams: any[] = [task_id];

    const { rowCount } = await query(queryString, queryParams);
    if (rowCount === 0)
        throw new InvalidRequestException(
            'Invalid Request: Unable to delete Assignment, Assignment does not exist.',
        );
};

export const updateAssignment = async (
    task_id: string | number,
    user_id: string | number,
    status: ASSIGNMENT_STATUS,
) => {
    let queryString = 'UPDATE assignment SET status = $3';

    if (status === 'ONGOING') {
        queryString += ', start_time = CURRENT_TIMESTAMP';
    } else if (status === 'COMPLETED') {
        queryString += ', end_time = CURRENT_TIMESTAMP';
    }

    queryString += ' WHERE task_id = $1 AND user_id = $2';

    if (status === 'ONGOING') {
        queryString += ' AND status is NULL AND start_time IS NULL;';
    } else if (status === 'COMPLETED') {
        queryString += " AND status = 'ONGOING' AND end_time IS NULL;";
    }

    const queryParams: any[] = [task_id, user_id, status];

    const { rowCount } = await query(queryString, queryParams);
    if (rowCount === 0)
        throw new InvalidRequestException(
            `Invalid Request: Unable to update Assignment status to ${status}`,
        );
};
