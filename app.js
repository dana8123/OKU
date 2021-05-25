// main 연결페이지
const express = require("express");
const app = express();
require("dotenv").config();
const cron = require("node-cron");
const helmet = require("helmet");
const path = require("path");
const passport = require("passport");
const passportConfig = require("./middlewares/passport");
const port = process.env.EXPRESS_PORT;
const webSocket = require("./socket");

// DB연결
const mongoose = require("mongoose");
const connect = require("./schema/dbConnect");
connect();

//임시 뷰, 소켓만 끝나면 지워버려야합니다.
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// CORS 처리
const cors = require("cors");
app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(express.static(path.join(__dirname, "uploads")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json());
app.use(passport.initialize());
passportConfig;
app.use(passport.session());

const { productRouter } = require("./routes/productRoutes");
const { chatRouter } = require("./routes/chatRoutes");
const { userRouter } = require("./routes/userRoutes");
const { socketRouter } = require("./routes/socketRoute");
const checkAuction = require("./controllers/checkAuction");

// second minute hour day-of-month month day-of-week
cron.schedule("1* * * * *", function () {
	checkAuction();
});

app.use("/chat", chatRouter);
app.use("/product", productRouter);
app.use("/user", userRouter);
app.use("/bid", socketRouter);

const server = app.listen(port, () => {
	console.log(`Server start at http://localhost:${port}`);
});

webSocket(server, app);
