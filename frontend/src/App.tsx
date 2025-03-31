import { useRef, useState } from "react"
import BeforeRoom from "./component/BeforeRoom"
import InsideRoom from "./component/InsideRoom"

function App() {
    const [isInRoom, setIsInRoom] = useState(false)
    const [roomId, setRoomId] = useState("")
    const [username, setUsername] = useState("")
    const codeRef = useRef<HTMLInputElement>(null)
    const usernameRef = useRef<HTMLInputElement>(null)

    // Forest Green theme only
    const theme = {
        name: "Forest Green",
        colors: {
            primary: "bg-green-600",
            secondary: "bg-green-400",
            background: "bg-gray-800",
            text: "text-white",
            inputBg: "bg-gray-700",
            selfMessage: "bg-green-500",
            otherMessage: "bg-gray-600",
        },
    }

    return (
        <>
            {!isInRoom && (
                <BeforeRoom
                    setRoomId={setRoomId}
                    setUsername={setUsername}
                    codeRef={codeRef}
                    usernameRef={usernameRef}
                    isInRoom={isInRoom}
                    setIsInRoom={setIsInRoom}
                    theme={theme}
                />
            )}
            {isInRoom && (
                <InsideRoom
                    roomId={roomId}
                    username={username}
                    setIsInRoom={setIsInRoom}
                    theme={theme}
                />
            )}
        </>
    )
}

export default App
