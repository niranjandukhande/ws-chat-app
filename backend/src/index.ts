import { WebSocketServer, WebSocket } from "ws"

const wss = new WebSocketServer({ port: 8080 })

interface User {
    socket: WebSocket
    room: string
    username: string
}

let allSockets: User[] = []

wss.on("connection", (socket) => {
    console.log("user connected")

    socket.on("message", (message) => {
        try {
            const parsedMessage = JSON.parse(message as unknown as string)

            if (parsedMessage.type === "join") {
                console.log(
                    `User ${parsedMessage.payload.username} joined room ${parsedMessage.payload.roomId}`
                )

                // Remove any existing connections from this socket
                allSockets = allSockets.filter((user) => user.socket !== socket)

                // Add new connection
                allSockets.push({
                    socket,
                    room: parsedMessage.payload.roomId,
                    username: parsedMessage.payload.username,
                })

                // Notify everyone in the room that a new user joined
                broadcastToRoom(parsedMessage.payload.roomId, {
                    message: `${parsedMessage.payload.username} has joined the room`,
                    sender: "System",
                })
            }

            if (parsedMessage.type === "chat") {
                const currentUser = allSockets.find(
                    (user) => user.socket === socket
                )

                if (currentUser) {
                    broadcastToRoom(currentUser.room, {
                        message: parsedMessage.payload.message,
                        sender: parsedMessage.payload.sender,
                    })
                }
            }
        } catch (error) {
            console.error("Error processing message:", error)
        }
    })

    socket.on("close", () => {
        const user = allSockets.find((user) => user.socket === socket)

        if (user) {
            broadcastToRoom(user.room, {
                message: `${user.username} has left the room`,
                sender: "System",
            })

            // Remove the socket from our list
            allSockets = allSockets.filter((u) => u.socket !== socket)
        }
    })
})

function broadcastToRoom(roomId: string, data: any) {
    for (const user of allSockets) {
        if (user.room === roomId) {
            user.socket.send(JSON.stringify(data))
        }
    }
}

console.log("WebSocket server running on port 8080")
