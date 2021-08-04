const http = require("./app");
const port = process.env.EXPRESS_PORT;
const dotenv = require("dotenv");
dotenv.config();
require("./socket");

http.listen(port, () => {
	console.log(`Server start at http://localhost:${port}`);
});
