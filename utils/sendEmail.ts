import mailer from '../core/mailer';
import { SentMessageInfo } from 'nodemailer/lib/sendmail-transport';

export interface IDataSendEmailProps {
	email: string;
	userName: string;
	fullName: string;
	password: string;
	confirmed_hash: string;
}

export const sendEmail = (
	data: IDataSendEmailProps,
	callback?: (err: Error | null, info: SentMessageInfo) => void
) => {
	mailer.sendMail(
		{
			from: 'admin@twitter.com',
			to: data.email,
			subject: 'Approve mail from Twitter Clone Tutorial',
			html: `Для того, чтобы подтвердить почту, перейдите http://localhost:${
				process.env.PORT || 8888
			}/auth/verify?hash=${data.confirmed_hash} по этой ссылке`,
		},
		callback ||
			function (err: Error | null, info: SentMessageInfo) {
				if (err) {
					console.log(err);
				} else {
					console.log(info);
				}
			}
	);
};
