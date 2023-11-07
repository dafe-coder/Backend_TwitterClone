import express from 'express';
import { UserCtrl } from './controllers/UserController';
import { registerValidation } from './validations/register';
import dotenv from 'dotenv';
import './core/db';

dotenv.config();

const app = express();

app.use(express.json());

app.get('/users', UserCtrl.index);
app.post('/users', registerValidation, UserCtrl.create);
app.patch('/users', UserCtrl.update);
app.delete('/users', UserCtrl.delete);

app.listen(8888, () => {
	console.log('SERVER RUNNING!');
});
