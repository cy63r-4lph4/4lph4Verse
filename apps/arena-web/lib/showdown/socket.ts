import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getShowdownSocket(token: string): Socket {
  if (socket && socket.connected) return socket;

  socket = io(`${process.env.NEXT_PUBLIC_WS_URL}/showdown`, {
    auth: { token },
    autoConnect: true,
    reconnection: true,
  });

  return socket;
}