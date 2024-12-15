import { File, Folder } from "lucide-react";
import { Mapping } from "@/Mapping";
import { OpenedFilePath, userSocket } from "@/store";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface File {
  name: string;
  path: string;
  type: string;
}

export function AppSidebar({ structure }: { structure: any }) {
  const ws = useRecoilValue(userSocket);
  const [filePath, setFilePath] = useRecoilState(OpenedFilePath);

  const selectedFile = (path: string) => {
    console.log("clicked", ws);
    setFilePath(path);
    ws?.send(
      JSON.stringify({
        type: "sendFilePath",
        payload: {
          filePath: path,
        },
      })
    );
  };
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Files</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {structure.map((item: File) => (
                <SidebarMenuItem
                  key={item.path}
                  onClick={() => selectedFile(item.path)}
                >
                  <SidebarMenuButton
                    className={`${
                      item.path == filePath && "bg-sidebar-accent"
                    } flex items-center`}
                  >
                    {item.type == "folder" ? (
                      <Folder />
                    ) : (
                      <img
                        className="w-[20px] h-[20px]"
                        src={
                          // @ts-ignore
                          Mapping[
                            item.name.split(".")[
                              item.name.split(".").length - 1
                            ]
                          ]
                        }
                      />
                    )}
                    <p>{item.name}</p>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
