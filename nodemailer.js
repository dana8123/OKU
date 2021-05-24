const nodemailer = require("nodemailer");
const { getMaxListeners } = require("./schema/user");

module.exports = async function main() {
	let testAccount = await nodemailer.createTestAccount();

	let transporter = nodemailer.createTransport({
		service: "naver",
		host: "smtp.naver.com",
		port: 587,
		secure: false,
		auth: {
			user: "sample02@naver.com",
			pass: "Iamaboss2021!",
		},
	});

	let info = await transporter.sendMail({
		from: '"Fred Foo"<yjk9313@gmail.com>',
		to: "yjk9313@gmail.com",
		subject: "hello nodemailer",
		text: "hello World",
		html: "<b>Hello world?<b>",
	});

	console.log("message sent: %s", info.messageId);

	console.log("preview URL: %S", nodemailer.getTestMessageUrl(info));
};

//main().catch(console.error);
