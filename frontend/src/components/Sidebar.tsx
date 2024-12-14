import { Mapping } from "@/Mapping";
import { OpenedFilePath, userSocket } from "@/store"
import { useRecoilState, useRecoilValue } from "recoil"

interface File {
    name: string;
    path: string;
    type: string;
}

const Sidebar = ({ Structure }) => {
    const ws = useRecoilValue(userSocket);
    const [,setFilePath] = useRecoilState(OpenedFilePath);

    const selectedFile = (path: string) => {
        console.log("clicked", ws);
        setFilePath(path);
        ws?.send(JSON.stringify({
            type: "sendFilePath",
            payload: {
                filePath: path
            }
        }))
    }

    return (
        <div className="border-r">
            
            <div className='w-full mt-[30px]  min-h-screen px-4'>
                {
                    Structure.map((FileInfo: File) => (
                        <div onClick={() => FileInfo.type == "file" && selectedFile(FileInfo.path)} className="flex items-center gap-3 my-1 cursor-pointer hover:bg-neutral-900 mb-2">
                            {/* @ts-ignore */}
                            <img className="w-[20px] h-[20px]" src={Mapping[FileInfo.name.split(".")[FileInfo.name.split(".").length - 1]]} />
                            <p>{FileInfo.name}</p>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Sidebar