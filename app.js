// main 연결페이지
const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.EXPRESS_PORT;

// DB연결
const mongoose = require("mongoose");
const connect = require("./schema/dbConnect");
connect();

// CORS 처리
const cors = require("cors");
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 뮬터 사용시에 활성화
// app.use(express.static('public'));

//const { chatRouter } = require("./routes/chatRoutes");
const { productRouter } = require("./routes/productroutes");
const { userRouter } = require("./routes/userroutes");

app.get("/", (req, res) => {
	res.send("연결이된거냐고..");
});
//app.use("/", [chatRouter]);
app.use("/product", productRouter);
app.use("/user", userRouter);

app.listen(port, () => {
	console.log(`Server start at http://localhost:${port}`);
});
