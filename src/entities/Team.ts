import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import Member from './Member';
import User from './User';

@Entity()
export default class Team {
    @PrimaryGeneratedColumn({ name: 'team_id' })
    teamID!: number;

    @Column('text')
    name!: string;

    @Column({ name: 'num_members', nullable: true })
    numMembers?: number;

    @ManyToOne(() => User, (user) => user.teams, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'administrator' })
    administrator?: User;

    @OneToMany(() => Member, (member) => member.team)
    members?: Member[];

    @CreateDateColumn()
    created?: Date;
}