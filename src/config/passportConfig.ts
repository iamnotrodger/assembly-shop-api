import passport, { Profile } from 'passport';
import {
    Profile as FacebookProfile,
    Strategy as FacebookStrategy,
} from 'passport-facebook';
import {
    OAuth2Strategy as GoogleStrategy,
    Profile as GoogleProfile,
    VerifyFunction,
} from 'passport-google-oauth';
import User from '../interface/User';
import { insertUser, selectUserByProvider } from '../models/UserModel';

const absoluteURL: string = process.env.URL ? process.env.URL : '';

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            callbackURL: absoluteURL + '/api/auth/google/callback',
        },
        async (
            accessToken: string,
            refreshToken: string,
            profile: GoogleProfile,
            done: VerifyFunction,
        ) => {
            try {
                let user: User = await selectUserByProvider(profile.id);

                if (!user) {
                    user = await registerUser(profile);
                }

                done(null, user);
            } catch (err) {
                done(err);
            }
        },
    ),
);

passport.use(
    new FacebookStrategy(
        {
            clientID: process.env.FACEBOOK_APP_ID!,
            clientSecret: process.env.FACEBOOK_APP_SECRET!,
            callbackURL: absoluteURL + 'api/auth/facebook/callback',
        },
        async (accessToken, refreshToken, profile: FacebookProfile, done) => {
            try {
                console.log(profile);
                let user: User = await selectUserByProvider(profile.id);

                if (!user) {
                    user = await registerUser(profile);
                }
                done(null, user);
            } catch (err) {
                done(err);
            }
        },
    ),
);

const registerUser = async (profile: Profile) => {
    const { id, provider, displayName, name } = profile;
    const email = profile.emails![0].value!;
    const picture =
        typeof profile.photos == null ? profile.photos![0].value : undefined;

    const user = await insertUser({
        id,
        provider,
        displayName,
        name,
        email,
        picture,
    });

    return user;
};
