import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export default class User {
    @PrimaryGeneratedColumn({ name: 'userID' })
    userID!: number;

    @Column('text', { name: 'provider_id', nullable: true })
    providerID?: string;

    @Column('text', { nullable: true })
    provider?: string;

    @Column('text')
    email!: string;

    @Column('text', { nullable: true })
    name?: string;

    @Column('text', { name: 'given_name', nullable: true })
    givenName?: string;

    @Column('text', { name: 'family_name', nullable: true })
    familyName?: string;

    @Column('text', { nullable: true })
    picture?: string;

    @CreateDateColumn()
    joined?: Date;
}
