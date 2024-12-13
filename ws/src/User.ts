import { WebSocket } from "ws";
import jwt from "jsonwebtoken";
import client from "./client";
import { SpaceManager } from "./SpaceManager";

export class User {
  private Id: string | null;
  private ws: WebSocket;
  private userName: string;
  constructor(token: string, ws: WebSocket) {
    this.ws = ws;
    this.Id = null;
    this.userName = "";
    const decode = jwt.verify(token, process.env.JWT_PASSWORD!) as {
      Id: string;
    };
    if (!decode) return;
    this.initUser(decode.Id!);
    this.initHandlers();
  }
  public getId() {
    return this.Id;
  }
  public getWs() : WebSocket {
    return this.ws;
  }
  async initUser(Id: string) {
    const user = await client.user.findFirst({ where: { Id } });
    this.Id = user?.Id!;
    this.userName = user?.name!;
  }
  initHandlers() {
    this.ws.on("message", async (data) => {
      const parsedData = JSON.parse(data.toString());
      switch (parsedData.type) {
        case "joinSpace":
          const Id = parsedData.payload.spaceId;
          const isSpace = await client.space.findFirst({ where: { Id } });
          if (isSpace && isSpace.type == "PRIVATE") {
            const user = await client.user.findFirst({
              where: {
                Id: this.Id!,
              },
              include: {
                space: true,
              },
            });
            SpaceManager.getInstance().joinUser(Id, this,user?.space);
          }
          break;
        default:
          break;
      }
    });
  }
}
