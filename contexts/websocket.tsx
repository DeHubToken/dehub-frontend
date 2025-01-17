"use client";

import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";

import { useActiveWeb3React } from "@/hooks/web3-connect";

import { env } from "@/configs";

const SocketsContext = createContext<any>({});

export const useWebSockets = () => useContext(SocketsContext);

export const SERVER_URL = env.socketUrl;  

// @ts-ignore
export const WebsocketProvider = ({ children }) => {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { account } = useActiveWeb3React();

  useEffect(() => {
    console.log("SERVER_URL",SERVER_URL)



    const socketOptions={
      query: {
        address: account
      }, 
    }

    const socket = io(SERVER_URL, socketOptions);

    socket.on("update-online-users", (users) => { 
      setOnlineUsers(users);
    });

    if (account) {
      socket.emit("join", account);
      socket.io.on("reconnect", (attemptNumber) => {
        socket.emit("join", account);
      });

      socket.io.on("reconnect_attempt", (attemptNumber) => {
        socket.emit("join", account);
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [account]);

  const contextValue = {
    onlineUsers,
    // @ts-ignore
    isUserOnline: (address: string) => onlineUsers.includes(address?.toLowerCase())
  };

  return <SocketsContext.Provider value={contextValue}>{children}</SocketsContext.Provider>;
};
