"use client"
import { createContext, useContext, useEffect, useMemo, useState, useRef } from "react";
import io, { Socket } from "socket.io-client";

import { useActiveWeb3React } from "@/hooks/web3-connect";
import { env } from "@/configs";
import { getAuthObject } from "@/web3/utils/web3-actions";

const SocketsContext = createContext<any>({});

export const useWebSockets = () => useContext(SocketsContext);

export const SERVER_URL = env.socketUrl;

export const WebsocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const { account, library } = useActiveWeb3React();

  useEffect(() => {
    let isMounted = true;

    const setUpSockets = async () => {
      // If we already have a socket connection, don't create a new one
      if (socketRef.current) {
        socketRef.current.disconnect();
      }

      const authObject = account ? await getAuthObject(library, account as string) : {};
      const socketIO = io(SERVER_URL, {
        auth: authObject,
      });

      socketIO.on("update-online-users", (users: string[]) => {
        if (isMounted) {
          setOnlineUsers(users);
        }
      });

      if (account) {
        socketIO.emit("join", account);
        socketIO.io.on("reconnect", () => {
          socketIO.emit("join", account);
        });
      }

      if (isMounted) {
        socketRef.current = socketIO;
        setSocket(socketIO);
      } else {
        socketIO.disconnect();
      }
    };

    setUpSockets();

    return () => {
      isMounted = false;
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [account, library]);

  const contextValue = useMemo(() => ({
    onlineUsers,
    isUserOnline: (address: string) => 
      address ? onlineUsers.includes(address.toLowerCase()) : false,
    socket: socket,
  }), [onlineUsers, socket]);

  return (
    <SocketsContext.Provider value={contextValue}>
      {children}
    </SocketsContext.Provider>
  );
};