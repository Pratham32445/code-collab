import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import Dashborad from './components/Dashborad';
import { useRecoilState } from 'recoil';
import { OpenedFileContent, OpenedFileExtension, OpenedFilePath, userSocket } from './store';

const Space = () => {
  const { spaceId } = useParams();
  const [loading, setLoading] = useState(true);
  const [spaceInfo, setSpaceInfo] = useState<any>(null);
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6IjU5NGQyNzRhLWVjMDktNDdmZi04MGQzLTQxOTY1OTIyZTA1YyIsImlhdCI6MTczNDA5MDI4NX0.RmHAeWIvmm46DXJvqlggJiQjvAb-UkzyrS8UfyJ474o"
  const wsRef = useRef<null | WebSocket>(null);
  const [, setWs] = useRecoilState(userSocket);
  const [, setContent] = useRecoilState(OpenedFileContent);
  const [, setExtension] = useRecoilState(OpenedFileExtension);

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