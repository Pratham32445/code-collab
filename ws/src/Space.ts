import { User } from "./User";
import fs from "fs";
import path from "path";

interface FileStructure {
  name: string;
  type: "file" | "folder";
  children?: FileStructure[];
  content?: string;
  path?: string;
}

export class FileSyncManager {
  generateFileStructure(rootPath: string) {
    const generateStructure = (currentPath: string): FileStructure => {
      const name = path.basename(rootPath);
      const stat = fs.statSync(rootPath);

      if (stat.isDirectory()) {
        const children = fs
          .readdirSync(currentPath)
          .map((item) => generateStructure(path.join(currentPath, item)));
        return {
          name,
          type: "folder",
          children,
          path: currentPath,
        };
      } else {
        return {
          name,
          type: "file",
          content: fs.readFileSync(currentPath, "utf-8"),
          path: currentPath,
        };
      }
    };
    return generateStructure(rootPath);
  }
}

export class Space {
  private Id: string;
  private Users: User[];
  private fileSyncManager: FileSyncManager | null;
  private admin: User | null;

  constructor(Id: string) {
    this.Id = Id;
    this.Users = [];
    this.fileSyncManager = null;
    this.admin = null;
  }

  initilizeSpaceFiles(rootpath: string) {
    this.fileSyncManager = new FileSyncManager();
    this.fileSyncManager.generateFileStructure(rootpath);
  }

  addUser(new_user: User, user_spaces: any) {
    if (this.admin && this.admin.getId() == new_user.getId()) {
      console.log("admin already there");
      return;
    }
    if (!this.admin) {
      if (this.isAdmin(user_spaces)) {
        this.admin = new_user;
        return;
      }
    }
    const isUser = this.Users.find((user) => user.getId() == new_user.getId());
    if (!isUser) {
      this.Users.push(new_user);
    }
  }

  private isAdmin(spaces: any) {
    return spaces.find((space: { Id: any }) => space.Id == this.Id);
  }
}
