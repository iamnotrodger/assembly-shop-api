import Assignment from './Assignment';

export default interface Task {
    task_id?: number;
    project_id: number;
    title: string;
    context?: string;
    assignment?: Assignment;
    created?: string;
}
