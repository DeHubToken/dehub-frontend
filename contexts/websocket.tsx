"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import io, { Socket } from "socket.io-client";

import { useActiveWeb3React } from "@/hooks/web3-connect";

import { env } from "@/configs";
import { getAuthObject } from "@/web3/utils/web3-actions";

const SocketsContext = createContext<any>({});

export const useWebSockets = () => useContext(SocketsContext);

export const SERVER_URL = env.socketUrl;

// @ts-ignore
export const WebsocketProvider = ({ children }) => {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState<any>();
  // const [io, setIo] = useState();
  const { account, library } = useActiveWeb3React();
  
  useEffect(() => {
    let socketIO: any;
    const setUpSockets = async () => {
      const authObject = account ? await getAuthObject(library, account as string) : {};
      socketIO = io(SERVER_URL, {
        auth: {
          ...authObject,
        },
      });
  
      socketIO.on("update-online-users", (users:any) => {
        setOnlineUsers(users);
      });
  
      if (account) {
        socketIO.emit("join", account);
        socketIO.io.on("reconnect", () => {
          socketIO.emit("join", account);
        });
      }
  
      setSocket(socketIO);
    };
  
    setUpSockets();
  
    return () => {
      if (socketIO) {
        socketIO.disconnect();
      }
    };
  }, [account]);

  const contextValue = useMemo(() => ({
    onlineUsers,
    // @ts-ignore
    isUserOnline: (address: string) => onlineUsers.includes(address?.toLowerCase()),
    socket: socket || null,
  }), [onlineUsers, socket]);

  return <SocketsContext.Provider value={contextValue}>{children}</SocketsContext.Provider>;
};
