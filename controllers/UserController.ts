import express from 'express';
import jwt from 'jsonwebtoken';
import { IUserModel, UserModel, UserModelDocument } from '../models/UserModel';
import { validationResult } from 'express-validator';
import { generateMD5 } from '../utils/generateHash';
import { sendEmail } from '../utils/sendEmail';
import { isValidObjectId } from '../utils/isValidObjId';
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
				errors: error,
			});
		}
	}

	async show(req: express.Request, res: express.Response): Promise<void> {
		try {
			const userID = req.params.id;

			if (!isValidObjectId(userID)) {
				res.status(400).send();
				return;
			}

			const user = await UserModel.findById(userID).exec();

			if (!user) {
				res.status(400).send();
				return;
			}
			res.json({
				status: 'success',
				data: user,
			});
		} catch (error) {
			res.status(500).json({
				status: 'error',
				errors: error,
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
			const data: IUserModel = {
				email: req.body.email,
				userName: req.body.userName,
				fullName: req.body.fullName,
				password: generateMD5(req.body.password + process.env.SECRET_KEY),
				confirmed_hash: generateMD5(
					process.env.SECRET_KEY || Math.random().toString()
				),
			};

			const user = await UserModel.create(data);
			sendEmail(data, (err: Error | null) => {
				if (err) {
					res.json({
						status: 'error',
						errors: err,
					});
				} else {
					res.json({
						status: 'success',
						data: user,
					});
				}
			});
		} catch (error) {
			res.json({
				status: 'error',
				errors: error,
			});
		}
	}

	async verify(req: express.Request, res: express.Response): Promise<void> {
		try {
			const hash = req.query.hash;
			if (!hash) {
				res.status(400).send();
				return;
			}
			const user = await UserModel.findOne({}).exec();
			if (user) {
				user.confirmed = true;
				user.save();
				res.json('success');
			} else {
				res.status(404).send('error user not found');
			}
		} catch (error) {
			res.json({
				status: 'error',
				errors: error,
			});
		}
	}

	async afterLoading(
		req: express.Request,
		res: express.Response
	): Promise<void> {
		try {
			const user = req.user
				? (req.user as UserModelDocument).toJSON()
				: undefined;
			res.json({
				status: 'success',
				data: {
					...user,
					token: jwt.sign({ data: req.user }, process.env.SECRET_KEY || '123', {
						expiresIn: '30d',
					}),
				},
			});
		} catch (error) {
			res.json({
				status: 'error',
				errors: error,
			});
		}
	}
	async getUserInfo(
		req: express.Request,
		res: express.Response
	): Promise<void> {
		try {
			const user = req.user
				? (req.user as UserModelDocument).toJSON()
				: undefined;
			res.json({
				status: 'success',
				data: user,
			});
		} catch (error) {
			res.json({
				status: 'error',
				errors: error,
			});
		}
	}

	async update() {}

	async delete(req: express.Request, res: express.Response): Promise<void> {
		try {
			await UserModel.deleteOne();
		} catch (error) {
			res.json({
				status: 'error',
				errors: error,
			});
		}
	}
}

export const UserCtrl = new UserController();
