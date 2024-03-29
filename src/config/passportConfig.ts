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
import { getManager } from 'typeorm';
import User from '../entity/User';

const absoluteURL: string = process.env.URL || '';

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
                const user = await findOrCreateUser(profile);
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
            callbackURL: absoluteURL + '/api/auth/facebook/callback',
            profileFields: ['id', 'emails', 'name', 'photos', 'locale'],
        },
        async (accessToken, refreshToken, profile: FacebookProfile, done) => {
            try {
                const user = await findOrCreateUser(profile);
                done(null, user);
            } catch (err) {
                done(err);
            }
        },
    ),
);

const findOrCreateUser = async (profile: Profile) => {
    const { id, provider, displayName, name, photos, emails } = profile;

    const userRepository = getManager().getRepository(User);
    let user = await userRepository.findOne({ providerID: id });

    if (!user) {
        user = new User();
        const email = emails && emails[0].value;
        const picture = photos && photos[0].value;
        const givenName = name && name.givenName;
        const familyName = name && name.familyName;

        user.email = email;
        user.providerID = id;
        user.provider = provider;
        user.name = displayName;
        user.givenName = givenName;
        user.familyName = familyName;
        user.picture = picture;

        await userRepository.save(user);
    }

    return user;
};
