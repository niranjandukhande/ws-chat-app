export default function BeforeRoom({
    codeRef,
    usernameRef,
    setIsInRoom,
    setRoomId,
    setUsername,
    theme,
}: any) {
    const enterRoom = () => {
        if (!codeRef.current?.value || !usernameRef.current?.value) {
            alert("Please enter both room code and username")
            return
        }

        const roomCode = codeRef.current.value
        const userName = usernameRef.current.value

        setRoomId(roomCode)
        setUsername(userName)
        setIsInRoom(true)
    }

    return (
        <div
            className={`min-h-screen ${theme.colors.background} flex items-center justify-center`}
        >
            <div
                className={`p-8 rounded-lg shadow-xl ${theme.colors.inputBg} max-w-md w-full`}
            >
                <h1
                    className={`text-2xl font-bold mb-6 ${theme.colors.text} text-center`}
                >
                    Join Chat Room
                </h1>
                <div className="space-y-4">
                    <div>
                        <label className={`block mb-2 ${theme.colors.text}`}>
                            Room Code
                        </label>
                        <input
                            ref={codeRef}
                            type="text"
                            placeholder="Enter room code"
                            className="w-full p-3 rounded bg-opacity-20 bg-white border border-gray-300 focus:outline-none focus:ring-2 ring-opacity-50 focus:ring-green-500"
                        />
                    </div>
                    <div>
                        <label className={`block mb-2 ${theme.colors.text}`}>
                            Username
                        </label>
                        <input
                            ref={usernameRef}
                            type="text"
                            placeholder="Choose a username"
                            className="w-full p-3 rounded bg-opacity-20 bg-white border border-gray-300 focus:outline-none focus:ring-2 ring-opacity-50 focus:ring-green-500"
                        />
                    </div>
                    <button
                        onClick={enterRoom}
                        className={`w-full p-3 rounded ${theme.colors.primary} ${theme.colors.text} font-medium mt-4 hover:opacity-90 transition-opacity`}
                    >
                        Enter Chat
                    </button>
                </div>
            </div>
        </div>
    )
}
