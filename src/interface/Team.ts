import User from './User';

export default interface Team {
    team_id?: number;
    name: string;
    administrator: number;
    create?: string;
}
