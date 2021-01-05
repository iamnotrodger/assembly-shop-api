export default interface Assignment {
    assignment_id?: number | string;
    task_id: number | string;
    user_id: number | string;
    start_time?: string;
    end_time?: string;
    status?: ASSIGNMENT_STATUS;
    created?: string;
}

export type ASSIGNMENT_STATUS = 'ONGOING' | 'COMPLETED' | 'UNAVAILABLE';
