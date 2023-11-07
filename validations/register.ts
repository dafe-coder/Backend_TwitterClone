import { body } from 'express-validator';

export const registerValidation = [
	body('email', 'Write e-mail')
		.isEmail()
		.withMessage('Wrong e-mail')
		.isLength({ min: 10, max: 40 })
		.withMessage(
			'Incorrect email length. Please, email length should be between 10 and 40.'
		),
	body('fullName', 'Write full name')
		.isString()
		.isLength({ min: 5, max: 70 })
		.withMessage('Max length in full name should be between 5 and 70.'),
	body('userName', 'Write user name')
		.isString()
		.isLength({ min: 3, max: 40 })
		.withMessage('User name length should be between 3 and 40.'),
	body('password', 'Password')
		.isString()
		.withMessage('Password length should be min 6 symbols')
		.custom((value, { req }) => {
			if (value !== req.body.password2) {
				throw new Error('Password doesn`t match');
			} else {
				return value;
			}
		}),
	// validator.body('confirmed_hash').isString(),
	// validator.body('location', 'Location').isString(),
	// validator.body('about', 'About').isString(),
	// validator.body('website', 'Website link').isString(),
	// validator.body('confirmed').isString(),
];
