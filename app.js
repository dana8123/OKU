// main 연결페이지
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cron = require("node-cron");
const Http = require("http");
const helmet = require("helmet");
const path = require("path");
const passport = require("passport");
const passportConfig = require("./middlewares/passport");

const app = express();
const http = Http.createServer(app);
// DB연결
const mongoose = require("mongoose");
const connect = require("./schema/dbConnect");
connect();

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
//채팅내역 삭제하는 코드, 현재 사용하지않음
//const checkChatting = require("./controllers/chekChatting");

// second minute hour day-of-month month day-of-week

//TODO: 리팩토링 후 주석 해제
// cron.schedule("1* * * * *", function () {
// 	checkAuction();
// });

app.use("/chat", chatRouter);
app.use("/product", productRouter);
app.use("/user", userRouter);
app.use("/bid", socketRouter);

app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({ message: err.message });
});

module.exports = http;
