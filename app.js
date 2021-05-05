// main 연결페이지
const express = require("express");
const app = express();
require("dotenv").config();
const path = require("path");
const port = process.env.EXPRESS_PORT;

const server = require('http').createServer(app);
// http server를 socket.io server로 upgrade한다
const io = require('socket.io')(server);

// DB연결
const mongoose = require("mongoose");
const connect = require("./schema/dbConnect");
connect();

// CORS 처리
const cors = require("cors");
app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "uploads")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json());

const { productRouter } = require("./routes/productRoutes");
//const { chatRouter } = require("./routes/chatRoutes");
const { userRouter } = require("./routes/userRoutes");

app.use("/product", productRouter);
//app.use("/", [chatRouter]);
app.use("/user", userRouter);

server.listen(port, () => {
	console.log(`Server start at http://localhost:${port}`);
});