import { WebSocket } from "ws";
import { Space } from "./Space";

export class User {
  private Id: string;
  private ws: WebSocket;
  public currentSpace: Space | null;
  private userName: string;
  constructor(Id: string, ws: WebSocket, userName = "") {
    this.Id = Id;
    this.ws = ws;
    this.currentSpace = null;
    this.userName = userName;
  }
  private setUserName(userName: string) {
    this.userName = userName;
  }
  public getId() {
    return this.Id;
  }
  public getSocket() {
    return this.ws;
  }
}
