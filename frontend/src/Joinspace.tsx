import React, { useState } from 'react'
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';
import { useNavigate } from "react-router-dom";

const Joinspace = () => {
    const [spaceId, setSpaceId] = useState("");
    const navigate = useNavigate();
    const JoinSpace = () => {
        if (spaceId) {
            navigate(`/space/:id`)
        }
    }
    return (
        <div>
            <Input onChange={(e) => setSpaceId(e.target.value)} />
            <Button onClick={JoinSpace}>Join</Button>
        </div>
    )
}

export default Joinspace