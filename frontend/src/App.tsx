import { Input } from "@/components/ui/input";
import { Button } from "./components/ui/button";

const App = () => {
  const addRoom = () => {
    
  }
  return (
    <div className="flex justify-center mt-[100px]">
      <div>
        <div className="flex gap-5">
          <Button onClick={addRoom}>Create Room</Button>
        </div>
        <div className="mt-[50px]">
          <Input placeholder="Enter room Id..." />
          <Button className="p-2 w-full my-2">Join Room</Button>
        </div>
      </div>
    </div>
  );
};

export default App;
