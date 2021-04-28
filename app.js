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

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public'));


const { productRouter } = require("./routes/productroutes");
//const { chatRouter } = require("./routes/chatroutes");
const { userRouter } = require("./routes/userroutes");

app.use("/product", productRouter);
//app.use("/", [chatRouter]);
app.use("/user", userRouter);
//app.use(express.static(__dirname));

app.listen(port, () => {
	console.log(`Server start at http://localhost:${port}`);
});
