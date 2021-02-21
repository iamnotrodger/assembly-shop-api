import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
    PrimaryGeneratedColumn,
} from 'typeorm';
import Team from './Team';

@Entity()
export default class Project {
    @PrimaryGeneratedColumn({ name: 'project_id' })
    projectID!: number;

    @Column()
    name?: string;

    @ManyToOne(() => Team, (team) => team.projects, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'team_id' })
    team?: Team;

    @CreateDateColumn()
    created?: Date;
}
