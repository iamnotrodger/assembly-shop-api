import { query } from '../config/postgresConfig';
import InvalidRequestException from '../exceptions/InvalidRequestException';
import NotFoundException from '../exceptions/NotFoundException';
import User, { UserProfile } from '../interface/User';

export const insertUser = async (user: UserProfile) => {
    const queryString =
        'INSERT INTO usr (provider_id, provider, name, email, picture, given_name, family_name) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING user_id, joined;';
    const queryParam: string[] = [
        user.id || '',
        user.provider || '',
        user.displayName,
        user.email,
        user.picture || '',
        user.name!.givenName || '',
        user.name!.familyName || '',
    ];

    const { rows } = await query(queryString, queryParam);
    return {
        ...user,
        user_id: rows[0].user_id,
        joined: rows[0].joined,
    } as User;
};

//Query for public information
export const selectUser = async (user_id: string | number) => {
    const queryString =
        'SELECT email, name, picture, given_name, family_name FROM usr WHERE user_id = $1;';
    const queryParam: any[] = [user_id];

    const { rows } = await query(queryString, queryParam);

    if (rows.length == 0) {
        throw new NotFoundException(
            `No User was found with this user-id: ${user_id}`,
        );
    }

    const user: User = {
        user_id: user_id as number,
        email: rows[0].email,
        name: rows[0].name,
        picture: rows[0].picture,
        giveName: rows[0].given_name,
        familyName: rows[0].family_name,
    };

    return user;
};

//Query user by oAuth Provider
export const selectUserByProvider = async (provider_id: string | number) => {
    const queryString = 'SELECT * FROM usr WHERE provider_id = $1;';
    const queryParam: any[] = [provider_id];

    const { rows } = await query(queryString, queryParam);
    return rows[0] as User;
};

export const updateName = async (
    user_id: string | number,
    givenName: string,
    familyName: string,
) => {
    const queryString =
        'UPDATE usr SET given_name = ($1), family_name = ($2) WHERE user_id = $3;';
    const queryParam: any[] = [givenName, familyName, user_id];
    const { rowCount } = await query(queryString, queryParam);

    if (rowCount === 0)
        throw new InvalidRequestException(
            `User does not exist with user ID: ${user_id}`,
        );
};

export const validateAdmin = async (
    user_id: string | number,
    team_id: string | number,
) => {
    const queryString =
        'SELECT FROM team WHERE administrator = $1 AND team_id = $2;';
    const queryParam: any[] = [user_id, team_id];
    const { rowCount } = await query(queryString, queryParam);

    return rowCount > 0;
};

export const validateMember = async (
    user_id: string | number,
    team_id: string | number,
) => {
    const queryString =
        'SELECT FROM team INNER JOIN team_member ON team.team_id = team_member.team_id WHERE user_id = $1 AND team_member.team_id = $2';
    const queryParam: any[] = [user_id, team_id];
    const { rowCount } = await query(queryString, queryParam);

    return rowCount > 0;
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

export const validateProjectMember = async (
    user_id: string | number,
    project_id: string | number,
) => {
    const queryString =
        'SELECT FROM project INNER JOIN team_member ON project.team_id = team_member.team_id WHERE project_id = $2 AND user_id = $1;';
    const queryParams: any[] = [user_id, project_id];
    const { rowCount } = await query(queryString, queryParams);
    return rowCount > 0;
};
