import ws, { WebSocketServer } from "ws";
import { User } from "./User";

const wss = new WebSocketServer({port : 3000});

wss.on("connection",(ws)=>{
    const user = new User("32",ws);
})