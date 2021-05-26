module.exports = async function main(users, subject) {
	let testAccount = await nodemailer.createTestAccount();

	const serverEmail = process.env.emailId;
	const serverNum = process.env.emailPw;
	let transporter = nodemailer.createTransport({
		service: "naver",
		host: "smtp.naver.com",
		port: 465,
		secure: false,
		auth: {
			user: serverEmail,
			pass: serverNum,
		},
	});
	try {
		let info = await transporter.sendMail({
			from: `"OKU"<${serverEmail}>`,
			to: users,
			subject: "<OKU> 안내메일 :" + subject,
			html:
				'<a href="http://myoku.co.kr"><img src="https://okuhanghae.s3.ap-northeast-2.amazonaws.com/public/%E1%84%8B%E1%85%A9%E1%84%8F%E1%85%AE%E1%84%85%E1%85%A9%E1%84%80%E1%85%A9-10___.png" ></a>' +
				"<br><br>" +
				"<p>오쿠를 이용해주셔서 감사합니다! 지금바로 오쿠에 접속해서 확인해보세요!</p>" +
				"<h3>오쿠 로고를 클릭하면 오쿠로 이동합니다!</h3>" +
				"<br>" +
				"<a href=`http://myoku.co.kr/chat`><h3>채팅하기</h3></a><p>에서 판매자와 대화하실 수 있습니다.</p>",
		});

		console.log("message sent: %s", info.messageId);
		console.log("message sent:" + users + "에게" + subject + "안내함");
	} catch (error) {
		console.log(error);
	}
};
