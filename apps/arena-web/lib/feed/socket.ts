import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getFeedSocket(token: string): Socket {
  if (socket && socket.connected) return socket;
  socket = io(`${process.env.NEXT_PUBLIC_WS_URL}/feed`, {
    auth: { token },
    autoConnect: true,
    reconnection: true,
  });
  return socket;
}