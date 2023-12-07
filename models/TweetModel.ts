import { model, Schema, Document } from 'mongoose';
import { IUserModel } from './UserModel';

export interface ITweetModel {
	_id?: string;
	text: string;
	user: IUserModel;
	images?: string[];
	// retweets: string;
	// likes: string;
	// replies: string;
}

export type TweetModelDocument = ITweetModel & Document;

const tweetSchema = new Schema({
	text: {
		type: String,
		required: true,
	},
	user: {
		required: true,
		ref: 'user',
		type: Schema.Types.ObjectId,
	},
	images: [
		{
			type: String,
		},
	],
});

tweetSchema.set('timestamps', true);

export const TweetModel = model<TweetModelDocument>('tweet', tweetSchema);
