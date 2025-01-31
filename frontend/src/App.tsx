import { useRef, useState } from "react";
import BeforeRoom from "./component/BeforeRoom";
import InsideRoom from "./component/InsideRoom";

function App() {
  const [isInRoom, setIsInRoom] = useState(false);
  const [roomId, setRoomid] = useState("");
  const codeRef = useRef<HTMLInputElement>();

  return (
    <>
      {!isInRoom && (
        <BeforeRoom
          setRoomId={setRoomid}
          codeRef={codeRef}
          isInRoom={isInRoom}
          setIsInRoom={setIsInRoom}
        />
      )}
      {isInRoom && <InsideRoom roomId={roomId} />}
    </>
  );
}

export default App;
