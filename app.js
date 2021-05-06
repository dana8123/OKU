// main 연결페이지
const express = require("express");
const app = express();
require("dotenv").config();
const path = require("path");
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
app.use(express.static(path.join(__dirname, "uploads")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json());

const { productRouter } = require("./routes/productRoutes");
const { chatRouter } = require("./routes/chatRoutes");
const { userRouter } = require("./routes/userRoutes");
const { socketRouter } = require("./routes/sockerRoute");

app.use("/", chatRouter);
app.use("/product", productRouter);
app.use("/user", userRouter);
app.use("/bid", socketRouter);

const server = app.listen(port, () => {
	console.log(`Server start at http://localhost:${port}`);
});

webSocket(server, app);
