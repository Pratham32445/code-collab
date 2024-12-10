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
  private admin: User;
  private Users: User[];
  private fileSyncManager: FileSyncManager | null;

  constructor(Id: string, admin: User) {
    this.Id = Id;
    this.admin = admin;
    this.Users = [];
    this.fileSyncManager = null;
  }

  initilizeSpaceFiles(rootpath: string) {
    this.fileSyncManager = new FileSyncManager();
    this.fileSyncManager.generateFileStructure(rootpath);
  }

  public addUser(new_user: User) {
    const isUserInSpace = this.Users.find(
      (user) => user.getId() == new_user.getId()
    );
    if (!isUserInSpace) {
      this.Users.push(new_user);
    }
  }
}
