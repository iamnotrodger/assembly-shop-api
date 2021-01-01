import { PoolClient } from 'pg';
import { exec, query } from '../config/postgresConfig';
import InvalidRequestException from '../exceptions/InvalidRequestException';
import Project from '../interface/Project';

export const insertProject = async (project: Project) => {
    const queryString =
        'INSERT INTO project (name, team_id) VALUES ($1, $2) RETURNING project_id;';
    const queryParams: any[] = [project.name, project.team_id];

    const { rows } = await query(queryString, queryParams);
    const { project_id } = rows[0];
    return project_id as number;
};

export const selectProjects = async (team_id: string | number) => {
    const queryString = 'SELECT * FROM project WHERE team_id = $1;';
    const queryParams: any[] = [team_id];

    const { rows } = await query(queryString, queryParams);
    return rows as Project[];
};

export const deleteProject = async (
    client: PoolClient,
    project_id: string | number,
) => {
    const queryString = 'DELETE FROM project WHERE project_id = $1;';
    const queryParams: any[] = [project_id];

    const { rowCount } = await exec(client, queryString, queryParams);

    if (rowCount === 0)
        throw new InvalidRequestException(
            `Invalid Request: Project (${project_id}) does not exist.`,
        );
};
