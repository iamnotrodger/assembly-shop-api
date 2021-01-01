export default interface Task {
    task_id?: number;
    project_id: number;
    title: string;
    context?: string;
    create?: string;
}
