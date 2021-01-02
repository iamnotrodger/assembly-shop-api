import { query } from '../config/postgresConfig';
import Task from '../interface/Task';

export const insertTask = async (task: Task) => {
    const queryString =
        'INSERT INTO task (project_id, title, context) VALUES ($1, $2, $3) RETURNING task_id;';
    const queryParams: any[] = [task.project_id, task.title, task.context];

    const { rows } = await query(queryString, queryParams);
    const { task_id } = rows[0];
    return task_id as number;
};
