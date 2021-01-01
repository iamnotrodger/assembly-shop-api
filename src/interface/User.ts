import { Profile } from 'passport';

export default interface User {
    user_id: number;
    email: string;

    name?: string;

    picture?: string;
    giveName?: string;
    familyName?: string;

    joined?: string;
}

export interface UserProfile extends Omit<Profile, 'emails' | 'photos'> {
    user_id?: number;
    picture?: string;
    email: string;
    joined?: string;
}
