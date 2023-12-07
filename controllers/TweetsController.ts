import express from 'express';
import { IUserModel } from '../models/UserModel';
import { validationResult } from 'express-validator';
import { ITweetModel, TweetModel } from '../models/TweetModel';
import { isValidObjectId } from '../utils/isValidObjId';
class TweetsController {
	async index(_: any, res: express.Response): Promise<void> {
		try {
			const tweets = await TweetModel.find({})
				.populate('user')
				.sort({ createdAt: -1 })
				.exec();
			res.json({
				status: 'success',
				data: tweets,
			});
		} catch (error) {
			res
				.json({
					status: 'error',
					errors: error,
				})
				.send('Server Error');
		}
	}

	async show(req: express.Request, res: express.Response): Promise<void> {
		try {
			const tweetId = req.params.id;

			if (!isValidObjectId(tweetId)) {
				res.status(400).send();
				return;
			}

			const tweet = await TweetModel.findById(tweetId).populate('user').exec();

			if (!tweet) {
				res.status(400).send();
				return;
			}
			res.json({
				status: 'success',
				data: tweet,
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
			// @ts-ignore-next-line comment.

			const user = req.user as IUserModel;

			if (user?._id) {
				const errors = validationResult(req);

				if (!errors.isEmpty()) {
					res.status(400).json({ status: 'error', errors: errors.array() });
					return;
				}

				const data: ITweetModel = {
					text: req.body.text,
					images: req.body.images,
					user: user,
				};

				const tweet = await TweetModel.create(data);

				res.json({
					status: 'success',
					data: tweet,
				});
			}
		} catch (error) {
			res.status(500).json({
				status: 'error',
				errors: error,
			});
		}
	}

	async delete(req: express.Request, res: express.Response): Promise<void> {
		try {
			// @ts-ignore-next-line comment.

			const user = req.user as IUserModel;

			if (user?._id) {
				const tweetID = req.params.id;

				if (!isValidObjectId(tweetID)) {
					res.status(400).send();
					return;
				}
				const tweet = await TweetModel.findById(tweetID);
				if (tweet) {
					if (tweet.user._id?.toString() === user._id.toString()) {
						await TweetModel.deleteOne({ _id: tweetID });
						res.send();
					} else {
						res.status(403).send();
					}
				} else {
					res.status(404).send();
				}
			}
		} catch (error) {
			res.status(500).json({
				status: 'error',
				errors: error,
			});
		}
	}

	async update(req: express.Request, res: express.Response): Promise<void> {
		try {
			// @ts-ignore-next-line comment.
			const user = req.user as IUserModel;

			if (user?._id) {
				const tweetID = req.params.id;

				if (!isValidObjectId(tweetID)) {
					res.status(400).send();
					return;
				}
				const tweet = await TweetModel.findById(tweetID);
				if (tweet) {
					if (tweet.user._id?.toString() === user._id.toString()) {
						const text = req.body.text;
						tweet.text = text;
						tweet.save();
						res.send();
					} else {
						res.status(403).send();
					}
				} else {
					res.status(404).send();
				}
			}
		} catch (error) {
			res.status(500).json({
				status: 'error',
				errors: error,
			});
		}
	}
}

export const TweetsCtrl = new TweetsController();
