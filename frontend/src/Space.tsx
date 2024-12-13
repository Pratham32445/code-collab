import React, { useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'

const Space = () => {
  const { spaceId } = useParams();
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6ImRlNmZkMDBjLTUwNmQtNGViNi1hMTc1LTYyMzY0NjQ0ZGEyOCIsImlhdCI6MTczNDA2NzE3Nn0.r8HAywdhJN2CDpLkKvwrc7dn5kzA__vP5uU8r3DstGU"
  const wsRef = useRef<null | WebSocket>(null);

  useEffect(() => {
    if (spaceId) {
      wsRef.current = new WebSocket(`ws://localhost:3000?token=${token}`);

      wsRef.current.onopen = () => {
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
        break;
      default:
        break;
    }
  }



  return (
    <div>Space</div>
  )
}

export default Space