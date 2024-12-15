import { WebSocket } from "ws";
import jwt from "jsonwebtoken";
import client from "./client";
import { SpaceManager } from "./SpaceManager";
import { getFileContent, updateFileContent } from "./fs";

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
  public getWs(): WebSocket {
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
            SpaceManager.getInstance().joinUser(Id, this, user?.space);
          }
          break;
        case "sendFilePath":
          const path = parsedData.payload.filePath;
          const content = await getFileContent(path);
          this.ws.send(
            JSON.stringify({
              type: "getFile-content",
              data: content,
              path,
            })
          );
          break;
        case "file-update":
          const filePath = parsedData.payload.filePath;
          const fileChanges = parsedData.payload.changes ;
          const spaceId = parsedData.payload.spaceId;
          updateFileContent(filePath, parsedData.payload.fullChange);
          const space = SpaceManager.getInstance().getSpace(spaceId);
          space?.getUsers().forEach((user) => {
            console.log(user.Id, this.Id);
            if (user.Id != this.Id) {
              user.ws.send(
                JSON.stringify({
                  type: "IncomingFileChange",
                  data: {
                    filePath,
                    fileChanges,
                  },
                })
              );
            }
          });
          break;
        default:
          break;
      }
    });
  }
}
