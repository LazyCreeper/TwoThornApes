import { io } from "socket.io-client";
import { removeTrail } from ".";

export const SocketStatus = {
  Connected: 1,
  Connecting: 2,
  Error: 0
};

let socket;

export const parseIp = (ip) => {
  if (ip.toLowerCase() === "localhost" || ip === "127.0.0.1") {
    return window.location.hostname;
  }
  return ip;
};

export const testFrontendSocket = async (remoteNode) => {
  const nodeCfg = remoteNode;
  let socketStatus;

  if (!nodeCfg || !nodeCfg.available || !nodeCfg.ip) {
    socketStatus = SocketStatus.Error;
  } else {
    try {
      socketStatus = SocketStatus.Connecting;
      await testConnect(
        parseIp(nodeCfg.ip) + ":" + nodeCfg.port,
        removeTrail(nodeCfg.prefix || "", "/") + "/socket.io"
      );
      socketStatus = SocketStatus.Connected;
    } catch (error) {
      console.error("Socket error: ", error);
      socketStatus = SocketStatus.Error;
    }
  }

  return socketStatus;
};

export const testConnect = (addr, path) => {
  socket = io(addr, {
    path,
    multiplex: false,
    timeout: 1000 * 30,
    reconnection: false,
    reconnectionAttempts: 0,
    rejectUnauthorized: false
  });

  return new Promise((resolve, reject) => {
    if (!socket) return reject(new Error("[Socket.io] socket is undefined"));

    socket.on("connect", () => {
      try {
        socket.disconnect();
      } finally {
        resolve(socket);
      }
    });

    socket.on("connect_error", (error) => {
      reject(error);
    });
  });
};
