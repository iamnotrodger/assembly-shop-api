import { query } from '../config/postgresConfig';
import InvalidRequestException from '../exceptions/InvalidRequestException';
import { ASSIGNMENT_STATUS } from '../interface/Assignment';
import Task from '../interface/Task';

export const selectTask = async (
    project_id: string | number,
    status?: ASSIGNMENT_STATUS,
) => {
    const queryString =
        'SELECT task.task_id, task.project_id, task.title, task.context, task.created, assignment.assignment_id, assignment.start_time, assignment.end_time, assignment.status, assignment.created as assignment_created, assignment.user_id, usr.email, usr.picture, usr.given_name, usr.family_name FROM assignment INNER JOIN usr ON assignment.user_id = usr.user_id RIGHT JOIN task ON assignment.task_id = task.task_id WHERE task.project_id = $1' +
        (status
            ? status === 'UNASSIGNED'
                ? ' AND assignment.assignment_id IS NULL;'
                : ' AND assignment.status = $2;'
            : ';');
    const queryParams: any[] = [
        project_id,
        ...(status && status !== 'UNASSIGNED' ? [status] : []),
    ];

    const { rows } = await query(queryString, queryParams);
    const tasks: Task[] = rows.map((task) => {
        return {
            task_id: task.task_id,
            project_id: task.project_id,
            title: task.title,
            context: task.context,
            created: task.created,
            assignment: task.assignment_id
                ? {
                      assignment_id: task.assignment_id,
                      task_id: task.task_id,
                      start_time: task.start_time,
                      end_time: task.end_time,
                      status: task.status,
                      created: task.assignment_created,
                      user: {
                          user_id: task.user_id,
                          email: task.email,
                          giveName: task.given_name,
                          familyName: task.family_name,
                          picture: task.picture,
                      },
                  }
                : undefined,
        };
    });

    return tasks;
};

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

export const updateTaskInfo = async (
    task_id: string | number,
    field: string,
    newValue: string,
) => {
    const queryString = `UPDATE task SET ${field} = $2 WHERE task_id = $1;`;
    const queryParams = [task_id, newValue];

    const { rowCount } = await query(queryString, queryParams);
    if (rowCount === 0)
        throw new InvalidRequestException(
            `Invalid Request: Unable to update Task's ${field}, Task (${task_id}) does not exist.`,
        );
};

export const validateTask = async (
    project_id: string | number,
    task_id: string | number,
) => {
    const queryString =
        'SELECT FROM task WHERE project_id = $1 AND task_id = $2;';
    const queryParams: any[] = [project_id, task_id];

    const { rowCount } = await query(queryString, queryParams);

    return rowCount > 0;
};
