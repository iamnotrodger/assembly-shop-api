import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import Log from './Log';
import Project from './Project';
import User from './User';

@Entity()
export default class Task {
    @PrimaryGeneratedColumn({ name: 'task_id' })
    taskID!: number;

    @Column('text')
    title?: string;

    @Column('text', { nullable: true })
    description?: string;

    @Column()
    completed?: boolean;

    @Column({ name: 'total_time' })
    totalTime?: number;

    @Column({ name: 'assignee', nullable: true })
    assigneeID?: number;

    @Column({ name: 'project_id' })
    projectID?: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'assignee' })
    assignee?: User;

    @OneToOne(() => Log, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'active_log' })
    activeLog?: Log | null;

    @ManyToOne(() => Project, (project) => project.tasks, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'project_id' })
    project?: Project;

    @OneToMany(() => Log, (log) => log.task)
    logs?: Log[];

    @CreateDateColumn()
    created?: Date;
}
