import * as dotenv from "dotenv";
const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router({});
const middleware = jsonServer.defaults({ static: __dirname + "/public" });
import { PORT } from "../utils";

server.use(middleware);
server.use(router);
export default server.listen(PORT + 1, () => {
  console.log("JSON Server is running");
});
