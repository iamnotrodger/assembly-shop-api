import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import Task from './Task';
import Team from './Team';

@Entity()
export default class Project {
    @PrimaryGeneratedColumn({ name: 'project_id' })
    projectID!: number;

    @Column()
    name?: string;

    @Column({ name: 'team_id' })
    teamID?: number;

    @ManyToOne(() => Team, (team) => team.projects, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'team_id' })
    team?: Team;

    @OneToMany(() => Task, (task) => task.project)
    tasks?: Task[];

    @CreateDateColumn()
    created?: Date;
}
