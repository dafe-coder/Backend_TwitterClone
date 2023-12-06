import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { UserCtrl } from './controllers/UserController';
import { registerValidation } from './validations/register';
import './core/db';
import { passport } from './core/passport';
import { TweetsCtrl } from './controllers/TweetsController';
import { createTweetValidations } from './validations/createTweet';
import { UploadCtrl } from './controllers/UploadFileController';

var session = require('express-session');
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage });

export function hasUser(
	request: Request
): request is Request & { user: number } {
	return 'user' in request && typeof request['user'] == 'number';
}

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
app.patch(
	'/tweets/:id',
	passport.authenticate('jwt'),
	createTweetValidations,
	TweetsCtrl.update
);

app.get('/auth/verify', registerValidation, UserCtrl.verify);
app.post('/auth/register', registerValidation, UserCtrl.create);
app.post('/auth/login', passport.authenticate('local'), UserCtrl.afterLoading);

app.post('/upload', upload.single('avatar'), UploadCtrl.upload);

// app.patch('/users', UserCtrl.update);
// app.delete('/users', UserCtrl.delete);

app.listen(process.env.PORT, () => {
	console.log('SERVER RUNNING!');
});
