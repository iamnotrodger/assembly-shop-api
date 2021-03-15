import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import Member from './Member';

@Entity()
export default class User {
    @PrimaryGeneratedColumn({ name: 'user_id' })
    userID!: number;

    @Column('text', { name: 'provider_id', nullable: true })
    providerID?: string;

    @Column('text', { nullable: true })
    provider?: string;

    @Column('text')
    email?: string;

    @Column('text', { nullable: true })
    name?: string;

    @Column('text', { name: 'given_name', nullable: true })
    givenName?: string;

    @Column('text', { name: 'family_name', nullable: true })
    familyName?: string;

    @Column('text', { nullable: true })
    picture?: string;

    @OneToMany(() => Member, (member) => member.user)
    member?: Member;

    @CreateDateColumn()
    joined?: Date;
}
