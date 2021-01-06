import User from './User';

export default interface Assignment {
    assignment_id?: number | string;
    task_id: number | string;
    user: number | string | User;
    start_time?: string;
    end_time?: string;
    status?: ASSIGNMENT_STATUS;
    created?: string;
}

export type ASSIGNMENT_STATUS = 'ONGOING' | 'COMPLETED' | 'UNASSIGNED';
