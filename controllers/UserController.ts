import express from 'express';
import { UserModel } from '../models/UserModel';
import { validationResult } from 'express-validator';
import { generateMD5 } from '../utils/GenerateHash';

class UserController {
	async index(_: any, res: express.Response): Promise<void> {
		try {
			const users = await UserModel.find({}).exec();
			res.json({
				status: 'success',
				data: users,
			});
		} catch (error) {
			res.json({
				status: 'error',
				errors: JSON.stringify(error),
			});
		}
	}

	async create(req: express.Request, res: express.Response): Promise<void> {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				res.status(400).json({ status: 'error', errors: errors.array() });
				return;
			}
			const data = {
				email: req.body.email,
				userName: req.body.userName,
				fullName: req.body.fullName,
				password: req.body.password,
				confirmed_hash: generateMD5(
					process.env.SECRET_KEY || Math.random().toString()
				),
			};

			const user = await UserModel.create(data);

			res.json({
				status: 'success',
				data: user,
			});
		} catch (error) {
			res.json({
				status: 'error',
				errors: JSON.stringify(error),
			});
		}
	}

	async update() {}
	async delete() {}
}

export const UserCtrl = new UserController();
