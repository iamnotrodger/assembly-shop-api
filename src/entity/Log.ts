import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import Task from './Task';

@Entity()
export default class Log {
    @PrimaryGeneratedColumn({ name: 'log_id' })
    logID!: number;

    @Column({ name: 'start_time' })
    startTime?: Date;

    @Column({ name: 'end_time', nullable: true })
    endTime?: Date;

    @Column({ name: 'task_id' })
    taskID?: number;

    @ManyToOne(() => Task, (task) => task.logs, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'task_id' })
    task?: Task;
}
