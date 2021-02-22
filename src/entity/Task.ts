import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
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
    finished?: boolean;

    @Column({ name: 'total_time' })
    totalTime?: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'assignee' })
    assignee?: User;

    @ManyToOne(() => Project, (project) => project.tasks)
    @JoinColumn({ name: 'project_id' })
    project?: Project;

    @CreateDateColumn()
    created?: Date;
}
