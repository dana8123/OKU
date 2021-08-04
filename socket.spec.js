const { createServer } = require("http");
const { Server } = require("socket.io");
//const Client = require("socket.io-client");
const assert = require("chai").assert;

describe("my awesome project", () => {
	let io, serverSocket, clientSocket;

	before((done) => {
		const httpServer = createServer();
		io = new Server(httpServer);
		httpServer.listen(() => {
			const port = httpServer.address().port;
			clientSocket = new Client("http://localhost:9090");
			io.on("connection", (socket) => {
				serverSocket = socket;
			});
			clientSocket.on("connect", done);
		});
	});
	after(() => {
		io.close();
		clientSocket.close();
	});

	it("should work", (done) => {
		clientSocket.on("hello", (arg) => {
			assert.equal(arg, "world");
			done();
		});
		serverSocket.emit("hello", "world");
	});

	it("should work (with ack)", (done) => {
		serverSocket.on("hi", (cb) => {
			cb("hola");
		});
		clientSocket.emit("hi", (arg) => {
			assert.equal(arg, "hola");
			done();
		});
	});
});
