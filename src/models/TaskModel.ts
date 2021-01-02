import { query } from '../config/postgresConfig';
import InvalidRequestException from '../exceptions/InvalidRequestException';
import Task from '../interface/Task';

export const insertTask = async (task: Task) => {
    const queryString =
        'INSERT INTO task (project_id, title, context) VALUES ($1, $2, $3) RETURNING task_id;';
    const queryParams: any[] = [task.project_id, task.title, task.context];

    const { rows } = await query(queryString, queryParams);
    const { task_id } = rows[0];
    return task_id as number;
};

export const deleteTask = async (task_id: string | number) => {
    const queryString = 'DELETE FROM task WHERE task_id = $1;';
    const queryParams: any[] = [task_id];

    const { rowCount } = await query(queryString, queryParams);
    if (rowCount === 0)
        throw new InvalidRequestException(
            `Invalid Request: Task (${task_id}) does not exist.`,
        );
};
