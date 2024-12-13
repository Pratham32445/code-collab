import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import Dashborad from './components/Dashborad';


const Space = () => {
  const { spaceId } = useParams();
  const [loading, setLoading] = useState(true);
  const [spaceInfo, setSpaceInfo] = useState<any>(null);
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6IjU5NGQyNzRhLWVjMDktNDdmZi04MGQzLTQxOTY1OTIyZTA1YyIsImlhdCI6MTczNDA5MDI4NX0.RmHAeWIvmm46DXJvqlggJiQjvAb-UkzyrS8UfyJ474o"
  const wsRef = useRef<null | WebSocket>(null);

  useEffect(() => {
    if (spaceId) {
      setLoading(true);
      wsRef.current = new WebSocket(`ws://localhost:3000?token=${token}`);

      wsRef.current.onopen = () => {
        setLoading(false);
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
    console.log(message);
    switch (message.type) {
      case "space-info":
        setSpaceInfo(message.data);
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