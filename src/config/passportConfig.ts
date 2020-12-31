import passport from 'passport';
import { Request } from 'express';
import {
    OAuth2Strategy as GoogleStrategy,
    VerifyFunction,
    Profile,
} from 'passport-google-oauth';
import { insertUser, selectUserByProvider } from '../models/UserModel';
import User from '../interface/User';

let absoluteURL: string = process.env.URL ? process.env.URL : '';

//Passport strategy for Google
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            callbackURL: absoluteURL + '/api/auth/google/callback',
            passReqToCallback: true,
        },
        async (
            req: Request,
            accessToken: string,
            refreshToken: string,
            profile: Profile,
            done: VerifyFunction,
        ) => {
            try {
                let user: User = await selectUserByProvider(profile.id);

                //Register user
                if (!user) {
                    const { id, provider, displayName, name } = profile;
                    const email = profile.emails![0].value!;
                    const picture =
                        typeof profile.photos == null
                            ? profile.photos![0].value
                            : undefined;

                    user = await insertUser({
                        id,
                        provider,
                        displayName,
                        name,
                        email,
                        picture,
                    });
                }

                done(null, user);
            } catch (err) {
                done(err);
            }
        },
    ),
);
