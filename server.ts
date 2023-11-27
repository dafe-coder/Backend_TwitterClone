import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { UserCtrl } from './controllers/UserController';
import { registerValidation } from './validations/register';
import './core/db';
import { passport } from './core/passport';
import { TweetsCtrl } from './controllers/TweetsController';
import { createTweetValidations } from './validations/createTweet';
var session = require('express-session');

const app = express();
app.use(
	session({
		secret: 'keyboard cat',
		resave: false,
		saveUninitialized: false,
		cookie: { secure: true },
	})
);

app.use(passport.initialize());
app.use(express.json());

app.get('/users', UserCtrl.index);
app.get('/users/me', passport.authenticate('jwt'), UserCtrl.getUserInfo);
app.get('/users/:id', UserCtrl.show);

app.get('/tweets/', TweetsCtrl.index);
app.get('/tweets/:id', TweetsCtrl.show);
app.delete('/tweets/:id', passport.authenticate('jwt'), TweetsCtrl.delete);
app.post(
	'/tweets',
	passport.authenticate('jwt'),
	createTweetValidations,
	TweetsCtrl.create
);

app.get('/auth/verify', registerValidation, UserCtrl.verify);
app.post('/auth/register', registerValidation, UserCtrl.create);
app.post('/auth/login', passport.authenticate('local'), UserCtrl.afterLoading);

// app.patch('/users', UserCtrl.update);
// app.delete('/users', UserCtrl.delete);

app.listen(process.env.PORT, () => {
	console.log('SERVER RUNNING!');
});
