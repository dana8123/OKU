const mongoose = require('mongoose');
require('dotenv').config();

const connect = () => {
	mongoose
		.connect(
			`mongodb://${process.env.DB_SERVER}:
				${process.env.DB_PORT}/${process.env.DB_DATABASE}`,
			{
				useNewUrlParser: true,
				useUnifiedTopology: true,
				useCreateIndex: true,
				ignoreUndefined: true,
				user: `${process.env.DB_ID}`,
				pass: `${process.env.DB_PASS}`
			}
		)
		.catch((err) => console.error(err));
};

mongoose.connection.on('error', (err) => {
	console.error('몽고디비 연결 에러', err);
});

module.exports = connect;
