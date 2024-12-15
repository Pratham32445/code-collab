import { atom } from "recoil";

export const OpenedFile = atom<string | null>({
  default: null,
  key: "OpenedFile",
});

export const OpenedFileContent = atom<string>({
  default: "//Write your code here",
  key: "OpenedFileContent",
});

export const userSocket = atom<WebSocket | null>({
  default: null,
  key: "userSocket",
});

export const OpenedFileExtension = atom<string>({
  default: "txt",
  key: "OpenedFileExtension",
});
export const OpenedFilePath = atom<string | null>({
  default: null,
  key: "openedFilePath",
});

export const IncomingChange = atom<IncomingFileChange | null>({
  default: null,
  key: "IncomingChange",
});

interface IncomingFileChange {
  filePath: string;
  fileChanges: {
    rangeOffSet: number,
    rangeLength: number,
    text: string;
  }[]
}
