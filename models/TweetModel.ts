import { model, Schema, Document } from 'mongoose';
import { IUserModel } from './UserModel';

export interface ITweetModel {
	_id?: string;
	text: string;
	user: IUserModel;
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
		ref: 'User',
		type: Schema.Types.ObjectId,
	},
});

export const TweetModel = model<TweetModelDocument>('Tweet', tweetSchema);
