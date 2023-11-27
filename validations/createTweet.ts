import { body } from 'express-validator';

export const createTweetValidations = [
	body('text', 'Write text for Tweet')
		.isString()
		.isLength({ max: 280 })
		.withMessage('Plz, check correct length! Max - 280 symbols'),
	body('user', 'User id'),
];
