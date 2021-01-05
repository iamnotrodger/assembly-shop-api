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

export const deleteAssignment = async (task_id: string | number) => {
    const queryString = 'DELETE FROM assignment WHERE task_id = $1;';
    const queryParams: any[] = [task_id];

    const { rowCount } = await query(queryString, queryParams);
    if (rowCount === 0)
        throw new InvalidRequestException(
            'Invalid Request: Unable to delete Assignment, Assignment does not exist.',
        );
};

export const validateAssignment = async (
    project_id: string | number,
    task_id: string | number,
) => {
    const queryString =
        'SELECT FROM task WHERE project_id = $1 AND task_id = $2;';
    const queryParams: any[] = [project_id, task_id];

    const { rowCount } = await query(queryString, queryParams);

    return rowCount > 0;
};
