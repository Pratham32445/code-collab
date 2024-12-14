import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import Dashborad from './components/Dashborad';
import { useRecoilState } from 'recoil';
import { IncomingChange, OpenedFileContent, OpenedFileExtension, userSocket } from './store';
import Cookies from "js-cookie";

const Space = () => {
  const { spaceId } = useParams();
  const [loading, setLoading] = useState(true);
  const [spaceInfo, setSpaceInfo] = useState<any>(null);
  const token = Cookies.get("authToken");
  const wsRef = useRef<null | WebSocket>(null);
  const [, setWs] = useRecoilState(userSocket);
  const [, setContent] = useRecoilState(OpenedFileContent);
  const [, setExtension] = useRecoilState(OpenedFileExtension);
  const [, setIncomingChange] = useRecoilState(IncomingChange);

  useEffect(() => {
    if (spaceId) {
      setLoading(true);
      wsRef.current = new WebSocket(`ws://localhost:3000?token=${token}`);

      wsRef.current.onopen = () => {
        setLoading(false);
        setWs(wsRef.current);
        wsRef.current?.send(JSON.stringify({
          type: "joinSpace",
          payload: {
            spaceId
          }
        }))
      }


      wsRef.current.onmessage = (event: any) => {
        const message = JSON.parse(event.data);
        handleWebSocketMessage(message);
      }

    }
  }, [spaceId])

  const handleWebSocketMessage = (message: any) => {
    switch (message.type) {
      case "space-info":
        setSpaceInfo(message.data);
        break;
      case "getFile-content":
        setContent(message.data.content);
        setExtension(message.data.extension);
        break;
      case "IncomingFileChange":
        console.log(message);
        setIncomingChange({
          filePath: message.data.filePath,
          fileContent: message.data.fileContent
        })
        break;
      default:
        break;
    }
  }



  return (
    (!loading && spaceInfo) ?
      <div>
        <Dashborad spaceInfo={spaceInfo} />
      </div> : <div>
        <p>Loading</p>
      </div>
  )
}

export default Space