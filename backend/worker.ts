import { httpServerHandler } from "cloudflare:node";
import express from "express";
import { RateLimitCounter } from "./lib/rateLimitStore.js";
import { app } from "./app.js";

const PORT = 3000;
const server = express();

server.use(app);
server.listen(PORT);

export { RateLimitCounter };
export default httpServerHandler({ port: PORT });
