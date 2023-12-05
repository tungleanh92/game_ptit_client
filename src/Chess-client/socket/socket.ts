import io from "socket.io-client";

const connection = process.env.REACT_APP_WEBSOCKET || "";

export const socket = io(connection);


