import { useEffect, useRef, useState } from "react"

interface Message {
    text: string
    sender: string
    isSelf: boolean
}

export default function InsideRoom({
    roomId,
    username,
    setIsInRoom,
    theme,
}: {
    roomId: string
    username: string
    setIsInRoom: (value: boolean) => void
    theme: any
}) {
    const [messages, setMessages] = useState<Message[]>([])
    const inputRef = useRef<HTMLInputElement>(null)
    const wsRef = useRef<WebSocket | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const messagesContainerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8080")

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data)
            setMessages((m) => [
                ...m,
                {
                    text: data.message,
                    sender: data.sender,
                    isSelf: data.sender === username,
                },
            ])
        }

        wsRef.current = ws

        ws.onopen = () => {
            ws.send(
                JSON.stringify({
                    type: "join",
                    payload: {
                        roomId: roomId,
                        username: username,
                    },
                })
            )
        }

        return () => {
            ws.close()
        }
    }, [roomId, username])

    const sendMessage = () => {
        const message = inputRef.current?.value || ""
        if (wsRef.current && message) {
            wsRef.current.send(
                JSON.stringify({
                    type: "chat",
                    payload: {
                        message: message,
                        sender: username,
                    },
                })
            )
            inputRef.current!.value = "" // Clear input after sending
        }
    }

    // Handle enter key press
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            sendMessage()
        }
    }

    const handleLogout = () => {
        // Close WebSocket connection
        if (wsRef.current) {
            wsRef.current.close()
        }

        // Return to login screen
        setIsInRoom(false)
    }

    return (
        <div className={`h-screen flex flex-col ${theme.colors.background}`}>
            {/* Header */}
            <div
                className={`p-4 ${theme.colors.primary} ${theme.colors.text} flex justify-between items-center shadow-md`}
            >
                <div className="font-medium">Room: {roomId}</div>
                <div className="flex items-center space-x-4">
                    <div className="text-sm font-medium">@{username}</div>
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-4"
            >
                {messages.length === 0 ? (
                    <div
                        className={`flex flex-col items-center justify-center h-full ${theme.colors.text} opacity-50`}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-12 w-12 mb-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                        </svg>
                        <p className="text-center">
                            No messages yet. Start the conversation!
                        </p>
                    </div>
                ) : (
                    messages.map((message, index) => (
                        <div
                            className={`flex ${
                                message.isSelf ? "justify-end" : "justify-start"
                            }`}
                            key={index}
                        >
                            <div className={`max-w-xs md:max-w-md lg:max-w-lg`}>
                                <div
                                    className={`text-xs ${
                                        theme.colors.text
                                    } opacity-75 ${
                                        message.isSelf
                                            ? "text-right"
                                            : "text-left"
                                    } mb-1`}
                                >
                                    {message.isSelf ? "You" : message.sender}
                                </div>
                                <div
                                    className={`rounded-lg px-4 py-2 inline-block ${
                                        message.isSelf
                                            ? `${theme.colors.selfMessage} rounded-br-none`
                                            : `${theme.colors.otherMessage} rounded-bl-none`
                                    } ${theme.colors.text}`}
                                >
                                    {message.text}
                                </div>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className={`p-4 ${theme.colors.inputBg} shadow-inner`}>
                <div className="flex rounded-lg overflow-hidden">
                    <input
                        ref={inputRef}
                        className="flex-1 p-3 bg-gray-700 text-white focus:outline-none"
                        placeholder="Type your message..."
                        onKeyPress={handleKeyPress}
                    />
                    <button
                        onClick={sendMessage}
                        className={`${theme.colors.primary} ${theme.colors.text} px-6 font-medium hover:opacity-90 transition-opacity flex items-center`}
                    >
                        <span className="mr-2 hidden sm:inline">Send</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    )
}
