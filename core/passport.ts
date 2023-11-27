import passport from 'passport';
var LocalStrategy = require('passport-local');
import { IUserModel, UserModel } from '../models/UserModel';
import { generateMD5 } from '../utils/generateHash';
var JwtStrategy = require('passport-jwt').Strategy,
	ExtractJwt = require('passport-jwt').ExtractJwt;

passport.use(
	new LocalStrategy(
		async (
			username: string,
			password: string,
			cb: (err: Error | null | unknown, result: boolean | IUserModel) => void
		): Promise<void> => {
			try {
				const user = await UserModel.findOne({
					$or: [{ email: username }, { userName: username }],
				}).exec();
				if (!user) {
					return cb(null, false);
				}
				console.log(user);

				if (user.password === generateMD5(password + process.env.SECRET_KEY)) {
					cb(null, user);
				} else {
					cb(null, false);
				}
			} catch (error) {
				cb(error, false);
			}
		}
	)
);

passport.use(
	new JwtStrategy(
		{
			secretOrKey: process.env.SECRET_KEY || '123',
			jwtFromRequest: ExtractJwt.fromHeader('token'),
		},
		async function (
			payload: { data: IUserModel },
			done: (a: Error | null | unknown, b: IUserModel | boolean) => void
		) {
			try {
				const user = await UserModel.findById(payload.data._id).exec();
				if (!user) return;
				done(null, user);
			} catch (error: unknown) {
				return done(error, false);
			}
		}
	)
);

passport.serializeUser(
	(user, cb: (err: Error | null, result: Express.User) => void) => {
		cb(null, user);
	}
);

passport.deserializeUser(
	(id: any, cb: (err: Error | null, result: IUserModel) => void) => {
		UserModel.findById(id, (err: any, user: IUserModel) => {
			cb(err, user);
		});
	}
);

export { passport };
