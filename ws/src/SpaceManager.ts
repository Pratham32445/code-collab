import path from "path";
import { saveToLocal } from "./fs";
import { Space } from "./Space";
import { User } from "./User";

export class SpaceManager {
  private spaces: Map<string, Space>;
  static Instance: SpaceManager | null;

  constructor() {
    this.spaces = new Map<string, Space>();
  }

  static getInstance() {
    if (!this.Instance) {
      this.Instance = new SpaceManager();
    }
    return this.Instance;
  }

  async joinUser(spaceId: string, user: User, user_spaces: any) {
    let space: Space;
    if (!this.spaces.has(spaceId)) {
      if (await saveToLocal(spaceId)) {
        space = new Space(spaceId);
        this.spaces.set(spaceId, space);
      }
    }
    space = this.spaces.get(spaceId)!;
    space?.addUser(user, user_spaces);
  }
}
