import { PoolClient } from 'pg';
import {
    commit,
    exec,
    query,
    rollback,
    transaction,
} from '../config/postgresConfig';
import InvalidRequestException from '../exceptions/InvalidRequestException';
import NotFoundException from '../exceptions/NotFoundException';
import Team from '../interface/Team';
import User from '../interface/User';

export const selectTeams = async (user_id: string | number) => {
    const queryString =
        'SELECT team.team_id, administrator, name, created FROM team INNER JOIN team_member ON team.team_id = team_member.team_id WHERE user_id = $1;';
    const queryParams: any[] = [user_id];

    const { rows } = await query(queryString, queryParams);
    if (rows.length == 0) {
        throw new NotFoundException(
            `User (${user_id}) is not a member of any team.`,
        );
    }

    return rows as Team[];
};

export const selectTeamMembers = async (team_id: string) => {
    const queryString =
        'SELECT usr.user_id, email, name, picture, given_name, family_name FROM team_member INNER JOIN usr ON team_member.user_id = usr.user_id WHERE team_id = $1;';
    const queryParams: any[] = [team_id];

    const { rows } = await query(queryString, queryParams);
    if (rows.length == 0) {
        throw new NotFoundException(
            `Team (${team_id}) does not have any members.`,
        );
    }

    return rows as User[];
};

export const insertTeamAndJoin = async (team: Team) => {
    const client: PoolClient = await transaction();

    try {
        team.team_id = await insertTeam(client, team);
        await insertMember(team.team_id, team.administrator, client);
        await commit(client);
    } catch (error) {
        await rollback(client);
        throw error;
    }
};

export const insertMember = async (
    team_id: string | number,
    user_id: string | number,
    client?: PoolClient,
) => {
    const queryString =
        'INSERT INTO team_member (team_id, user_id) VALUES ($1, $2);';
    const queryParams: any[] = [team_id, user_id];

    if (client) await exec(client, queryString, queryParams);
    else await query(queryString, queryParams);
};

export const deleteMember = async (
    team_id: string | number,
    user_id: string | number,
) => {
    const queryString =
        'DELETE FROM team_member WHERE team_id = $1 AND user_id = $2;';
    const queryParams: any[] = [team_id, user_id];

    const { rowCount } = await query(queryString, queryParams);

    if (rowCount === 0)
        throw new InvalidRequestException(
            `Invalid Request: Team (${team_id}) does not exist or User (${user_id}) does not exist/is not a member of the Team.`,
        );
};

const insertTeam = async (client: PoolClient, team: Team) => {
    const queryString =
        'INSERT INTO team (administrator, name) VALUES ($1, $2) RETURNING team_id;';
    const queryParams: any[] = [team.administrator, team.name];

    const { rows } = await exec(client, queryString, queryParams);
    const { team_id } = rows[0];

    return team_id as number;
};
