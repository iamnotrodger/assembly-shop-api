import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import Team from './Team';
import User from './User';

@Entity()
@Index(['user', 'team'], { unique: true })
export default class Member {
    @PrimaryGeneratedColumn({ name: 'member_id' })
    memberID!: number;

    @Column({ name: 'user_id' })
    userID?: number;

    @ManyToOne(() => User, (user) => user.member, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @ManyToOne(() => Team, (team) => team.members, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'team_id' })
    team!: Team;
}
