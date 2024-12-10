import { Space } from "./Space";
import { User } from "./User";
import { v4 as uuidv4 } from "uuid";

class SpaceManager {
  private spaces: Map<string, Space>;

  constructor() {
    this.spaces = new Map<string, Space>();
  }

  createSpace(name: string, admin: User) {
    const spaceId = uuidv4();
    if (!this.spaces.has(spaceId)) {
      const new_space = new Space(spaceId, admin);
      this.spaces.set(spaceId, new_space);
    }
  }

  joinSpace(spaceId: string, user: User) {
    if (this.spaces.has(spaceId)) {
      const space = this.spaces.get(spaceId);
      if (space) {
        user.currentSpace = space;
        space?.addUser(user);
      }
    }
  }
}
