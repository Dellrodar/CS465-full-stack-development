import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../models/user.js';

passport.use(
    new LocalStrategy(
        {
            usernameField: 'email',
        },
        async (username, password, done) => {
            const q = await User.findOne({ email: username }).exec();
            if (!q) {
                return done(null, false, {
                    message: 'Incorrect username.',
                });
            }
            if (!q.validPassword(password)) {
                return done(null, false, {
                    message: 'Incorrect password.',
                });
            }
            return done(null, q);
        }
    )
);
