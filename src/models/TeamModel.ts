import { PoolClient } from 'pg';
import User from '../interface/User';
import Team from '../interface/Team';
import {
    commit,
    exec,
    query,
    rollback,
    transaction,
} from '../config/postgresConfig';
import NotFoundException from '../exceptions/NotFoundException';

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
        await insertAdminToTeam(client, team);
        await commit(client);
    } catch (error) {
        await rollback(client);
        throw error;
    }
};

export const insertMember = async (
    team_id: string | number,
    user_id: string | number,
) => {
    const queryString =
        'INSERT INTO team_member (team_id, user_id) VALUES ($1, $2);';
    const queryParams: any[] = [team_id, user_id];

    await query(queryString, queryParams);
};

const insertTeam = async (client: PoolClient, team: Team) => {
    const queryString =
        'INSERT INTO team (administrator, name) VALUES ($1, $2) RETURNING team_id;';
    const queryParams: any[] = [team.administrator, team.name];

    const { rows } = await exec(client, queryString, queryParams);
    const { team_id } = rows[0];

    return team_id as number;
};

const insertAdminToTeam = async (client: PoolClient, team: Team) => {
    const queryString =
        'INSERT INTO team_member (team_id, user_id) VALUES ($1, $2);';
    const queryParams: any[] = [team.team_id, team.administrator];

    await exec(client, queryString, queryParams);
};
