import ws, { WebSocketServer } from "ws";
import { User } from "./User";
import url from "url";

const wss = new WebSocketServer({ port: 3000 });

wss.on("connection", (ws, req) => {
  console.log("connected")
  const token: string = url.parse(req.url!, true).query.token as string;
  if (!token) {
    ws.close();
    return;
  }
  const user = new User(token, ws);
});
