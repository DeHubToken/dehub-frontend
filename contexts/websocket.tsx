"use client"
import { createContext, useContext, useEffect, useMemo, useState, useRef } from "react";
import io, { Socket } from "socket.io-client";

import { useActiveWeb3React } from "@/hooks/web3-connect";
import { env } from "@/configs";
import { getAuthObject } from "@/web3/utils/web3-actions";

class StreamingClient {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private isMounted = true;
  private onlineUsersCallback: ((users: string[]) => void) | null = null;

  constructor(
    private url: string, 
    private getAuthParams: () => Promise<any>,
    private onOnlineUsers: (users: string[]) => void
  ) {
    this.onlineUsersCallback = onOnlineUsers;
  }

  public async connect(address: string | null | undefined) {
    if (this.socket) {
      this.cleanup();
    }

    const socketOptions = {
      query: { address },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: this.maxReconnectAttempts,
    };

    const authObject = address ? await this.getAuthParams() : {};
    
    this.socket = io(this.url, {
      auth: authObject,
      ...socketOptions
    });

    this.setupEventHandlers();
    this.startHeartbeat();
  }

  private setupEventHandlers() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Connected to streaming server');
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected:', reason);
      if (reason === 'io server disconnect') {
        // Server initiated disconnect, try to reconnect
        this.socket?.connect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
        this.cleanup();
      }
    });

    this.socket.on("update-online-users", (users: string[]) => {
      if (this.isMounted && this.onlineUsersCallback) {
        this.onlineUsersCallback(users);
      }
    });
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.socket?.connected) {
        this.socket.emit('heartbeat');
      }
    }, 10000); // 10 seconds
  }

  public cleanup() {
    this.isMounted = false;
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  public getSocket() {
    return this.socket;
  }
}

const SocketsContext = createContext<any>({});

export const useWebSockets = () => useContext(SocketsContext);

export const SERVER_URL = env.NEXT_PUBLIC_SOCKET_URL;

export const WebsocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const streamingClientRef = useRef<StreamingClient | null>(null);
  const { account, library } = useActiveWeb3React();

  useEffect(() => {
    const getAuth = async () => {
      return await getAuthObject(library, account as string);
    };

    if (!streamingClientRef.current) {
      streamingClientRef.current = new StreamingClient(
        SERVER_URL,
        getAuth,
        setOnlineUsers
      );
    }

    streamingClientRef.current.connect(account);

    // Update socket state when connection is established
    const socketCheck = setInterval(() => {
      const currentSocket = streamingClientRef.current?.getSocket();
      if (currentSocket?.connected) {
        setSocket(currentSocket);
        clearInterval(socketCheck);
      }
    }, 100);

    return () => {
      clearInterval(socketCheck);
      if (streamingClientRef.current) {
        streamingClientRef.current.cleanup();
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