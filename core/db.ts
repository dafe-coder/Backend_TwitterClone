import mongoose, { ConnectOptions } from 'mongoose';

mongoose.Promise = Promise;
// ts-ignore-next-line
mongoose.connect(process.env.MONGODB_URI || 'mongodb:127.0.0.1:27017/twitter', {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
} as ConnectOptions);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error: '));

export { db, mongoose };
