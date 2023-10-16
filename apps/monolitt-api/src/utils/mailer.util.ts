import config from 'config';
import nodemailer, { SendMailOptions } from 'nodemailer';
import log from './logger.util';

// Print test creds when starting the application (replace config on default.ts 'smpt')
// async function createTestCreds() {
// 	const creds = await nodemailer.createTestAccount();
// 	console.log(creds);
// }

// createTestCreds();

const smtp = config.get<{
	user: string,
	pass: string,
	host: string,
	port: number,
	secure: boolean ,
}>('smtp');

// In order to send emails, nodemailer needs a transporter (the object capable of sending the email)
const transport = nodemailer.createTransport({
	...smtp,
	auth: { user: smtp.user, pass: smtp.pass }
});

// Function that calls the transport and logs the state of the sent email
async function sendEmail(payload: SendMailOptions) { 
	transport.sendMail(payload, (err, info) => {
		if(err) {
			log.error(err, 'Error sending the email.');
			return;
		}

		log.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
	});
}

export default sendEmail;
