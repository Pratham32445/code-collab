import { User } from "./User";
import fs from "fs";
import path from "path";

interface FileStructure {
  name: string;
  type: "file" | "folder";
  path?: string;
}

export class Space {
  private Id: string;
  private Users: User[];
  private admin: User | null;

  constructor(Id: string) {
    this.Id = Id;
    this.Users = [];
    this.admin = null;
  }

  addUser(new_user: User, user_spaces: any) {
    if (this.admin && this.admin.getId() == new_user.getId()) {
      console.log("admin already there");
      return;
    }
    if (!this.admin) {
      if (this.isAdmin(user_spaces)) {
        this.admin = new_user;
        this.spaceInfo(new_user, true);
        return;
      }
    }
    this.Users.push(new_user);
    this.spaceInfo(new_user);
  }

  private isAdmin(spaces: any) {
    return spaces.find((space: { Id: any }) => space.Id == this.Id);
  }

  private spaceInfo(user: User, isAdmin = false) {
    const rootPath = path.join(__dirname, "./projects", this.Id);

    const Info = {
      type: "space-info",
      data: {
        Id: this.Id,
        admin: this.admin,
        users: this.Users,
        Structure: this.getFolderAndFiles(rootPath),
        isAdmin,
      },
    };

    this.SendUser(user, Info);
  }

  private SendUser(user: User, payload: any) {
    user.getWs().send(JSON.stringify(payload));
  }

  private getFolderAndFiles(rootPath: string) {
    const Structure: FileStructure[] = [];
    const files = fs.readdirSync(rootPath);
    files.forEach((file) => {
      const fullPath = path.join(rootPath, file);
      const isDir = fs.statSync(fullPath);
      if (isDir.isDirectory()) {
        Structure.push({
          name: file,
          type: "folder",
          path: fullPath,
        });
      } else {
        Structure.push({
          name: file,
          type: "file",
          path: fullPath,
        });
      }
    });
    return Structure;
  }

  public getUsers() {
    return this.Users;
  }

}
