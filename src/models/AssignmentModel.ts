import { query } from '../config/postgresConfig';
import Assignment from '../interface/Assignment';

// TODO: validate that the user is

export const insertAssignment = async (assignment: Assignment) => {
    const queryString =
        'INSERT INTO assignment (task_id, user_id) VALUES ($1, $2) RETURNING assignment_id;';
    const queryParams: any[] = [assignment.task_id, assignment.user_id];

    const { rows } = await query(queryString, queryParams);
    const { assignment_id } = rows[0];
    return assignment_id as number;
};
