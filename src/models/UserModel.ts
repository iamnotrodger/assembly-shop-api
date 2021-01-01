import NotFoundException from '../exceptions/NotFoundException';
import User, { UserProfile } from '../interface/User';
import { query } from '../config/postgresConfig';
import InvalidRequestException from '../exceptions/InvalidRequestException';

export const insertUser = async (user: UserProfile) => {
    const queryString =
        'INSERT INTO usr (provider_id, provider, name, email, picture, given_name, family_name) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING user_id, joined;';
    const queryParam: string[] = [
        user.id || '',
        user.provider || '',
        user.displayName,
        user.email,
        user.picture || '',
        user.name?.givenName || '',
        user.name?.familyName || '',
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
        'SELECT user_id, username, picture, email FROM usr WHERE user_id = $1;';
    const queryParam: any[] = [user_id];

    const { rows } = await query(queryString, queryParam);

    if (rows.length == 0) {
        throw new NotFoundException(
            `No User was found with this user-id: ${user_id}`,
        );
    }

    return rows[0] as User;
};

//Query for private information
export const selectProfile = async (user_id: string | number) => {
    const queryString = 'SELECT * FROM usr WHERE user_id = $1;';
    const queryParam: any[] = [user_id];

    const { rows } = await query(queryString, queryParam);
    if (rows.length == 0) {
        throw new NotFoundException(
            `No User was found with this user-id: ${user_id}`,
        );
    }
    return rows[0] as UserProfile;
};

//Query user by oAuth Provider
export const selectUserByProvider = async (provider_id: string | number) => {
    const queryString = 'SELECT * FROM usr WHERE provider_id = $1;';
    const queryParam: any[] = [provider_id];

    const { rows } = await query(queryString, queryParam);
    return rows[0] as User;
};

export const isUsernameValid = async (username: string) => {
    const queryString = 'SELECT username FROM usr WHERE username = $1;';
    const queryParam = [username];
    const { rows } = await query(queryString, queryParam);

    if (rows.length == 0) return true;
    return false;
};

export const updateUsername = async (
    user_id: string | number,
    username: string,
) => {
    const queryString = 'UPDATE usr SET username = ($1) WHERE user_id = $2;';
    const queryParam: any[] = [username, user_id];
    const { rowCount } = await query(queryString, queryParam);

    if (rowCount === 0)
        throw new InvalidRequestException(
            `User does not exist with user ID: ${user_id}`,
        );
};
