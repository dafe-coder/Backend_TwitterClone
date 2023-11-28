import { model, Schema, Document } from 'mongoose';
export interface IUserModel {
	_id?: string;
	email: string;
	fullName: string;
	userName: string;
	password: string;
	confirmed_hash: string;
	confirmed?: boolean;
	location?: string;
	about?: string;
	website?: string;
}

export type UserModelDocument = IUserModel & Document;

const userSchema = new Schema({
	email: {
		unique: true,
		required: true,
		type: String,
	},
	fullName: {
		required: true,
		type: String,
	},
	userName: {
		unique: true,
		required: true,
		type: String,
	},
	password: {
		required: true,
		type: String,
	},
	confirmed_hash: {
		required: true,
		type: String,
	},
	confirmed: {
		type: Boolean,
		default: false,
	},
	location: String,
	about: String,
	website: String,
});

userSchema.set('toJSON', {
	transform: function (doc, obj) {
		delete obj.password;
		delete obj.confirmed_hash;
		return obj;
	},
});

export const UserModel = model<UserModelDocument>('user', userSchema);
