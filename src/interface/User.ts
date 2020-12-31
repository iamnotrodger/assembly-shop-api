import { Profile } from 'passport';

export default interface User {
    user_id: number;
    username?: string;
    email: string;

    followers?: number;
    following?: number;
    joined?: string;
}

export interface UserProfile extends Omit<Profile, 'emails' | 'photos'> {
    user_id?: number;
    picture?: string;
    email: string;
    joined?: string;
}
