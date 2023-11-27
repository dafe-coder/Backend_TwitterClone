import mongoose from 'mongoose';

mongoose.Promise = Promise;

mongoose.connect(
	'mongodb://127.0.0.1:27017/twitter' || process.env.MONGODB_URI
);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error: '));

export { db, mongoose };
