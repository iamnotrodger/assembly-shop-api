import { query } from '../config/postgresConfig';
import InvalidRequestException from '../exceptions/InvalidRequestException';
import Project from '../interface/Project';

export const selectProjects = async (team_id: string | number) => {
    const queryString = 'SELECT * FROM project WHERE team_id = $1;';
    const queryParams: any[] = [team_id];

    const { rows } = await query(queryString, queryParams);
    return rows as Project[];
};

export const insertProject = async (project: Project) => {
    const queryString =
        'INSERT INTO project (name, team_id) VALUES ($1, $2) RETURNING project_id;';
    const queryParams: any[] = [project.name, project.team_id];

    const { rows } = await query(queryString, queryParams);
    const { project_id } = rows[0];
    return project_id as number;
};

export const deleteProject = async (project_id: string | number) => {
    const queryString = 'DELETE FROM project WHERE project_id = $1;';
    const queryParams: any[] = [project_id];

    const { rowCount } = await query(queryString, queryParams);

    if (rowCount === 0)
        throw new InvalidRequestException(
            `Invalid Request: Project (${project_id}) does not exist.`,
        );
};

export const updateProjectName = async (
    project_id: string | number,
    name: string,
) => {
    const queryString = 'UPDATE project SET name = $2 WHERE project_id = $1;';
    const queryParams: any[] = [project_id, name];

    const { rowCount } = await query(queryString, queryParams);

    if (rowCount === 0)
        throw new InvalidRequestException(
            `Invalid Request: Unable to update Project's name, Project (${project_id}) does not exist.`,
        );
};

export const validateProjectAdmin = async (
    user_id: string | number,
    project_id: string | number,
) => {
    const queryString =
        'SELECT FROM project INNER JOIN team ON project.team_id = team.team_id WHERE administrator = $1 AND project_id = $2;';
    const queryParams: any[] = [user_id, project_id];
    const { rowCount } = await query(queryString, queryParams);
    return rowCount > 0;
};
