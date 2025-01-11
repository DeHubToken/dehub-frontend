"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { useActiveWeb3React } from "@/hooks/web3-connect";

import { createContext } from "@/libs/context";

import { exitGroup, fetchContacts, fetchDmMessages } from "@/services/dm";
import { blockDM, unBlockUser } from "@/services/user-report";

import { messages, SocketEvent, TMessage } from "../utils";
import { Button } from "@/components/ui/button";

type State = {
  socket: any;
  selectedMessageId: string | null;
  selectedMessage: TMessage | undefined | null;
  messages: TMessage[];
  status: "idle" | "loading" | "error" | "success";
  setSelectedMessageId: (id: string | null) => void;
  startNewChat: ({
    address,
    username,
    _id
  }: {
    address: string;
    username: string;
    _id?: string;
  }) => void;
  sendMessage: (newMsg: string) => void;
  deleteMessage: (messageId: string, dmId: string) => void;
  setMessages: any;
  handleAddNewChat: any;
  input: string;
  setInput: (input: string) => void;
  handleToggleGif: (input: boolean) => void;
  handleToggleEmoji: (input: boolean) => void;
  handleToggleMedia: (input: boolean) => void;
  handleToggleTipModal: (input: boolean) => void;
  handleUnBlock: () => void;
  handleToggleUserReport: (input: boolean) => void;
  handleToggleConversationMoreOptions: (input: boolean) => void;
  blockChatHandler: (input: string) => Promise<any>;
  reValidateMessage: (messageId: string, dmId: string) => void;
  handleExitGroup: (userAddress: string) => void;
  setChatStatus: (data: any) => void;
  chatStatus: any;
  toggleMedia: boolean;
  toggleEmoji: boolean;
  toggleGif: boolean;
  toggleTipModal: boolean;
  toggleUserReport: boolean;
  toggleConversationMoreOptions: boolean;
  permissions: {};
  me: any;
};

const [Provider, useMessage] = createContext<State>("MessagesScreen");

export function MessageProvider(props: { children: React.ReactNode; socketConnections: any }) {
  const { account }: any = useActiveWeb3React();
  const socket = props?.socketConnections?.current?.dm;
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [status, setStatus] = useState<State["status"]>("idle");
  const [messages, setMessages] = useState<any>([]);
  const message: any & { _id: string } = messages.find((msg: any) => msg._id === selectedMessageId);
  const me = message?.participants.find(
    (p: any) => p?.participant?.address == account?.toLowerCase()
  );

  const [input, setInput] = useState("");
  const [toggleEmoji, setToggleEmoji] = useState(false);
  const [toggleGif, setToggleGif] = useState(false);
  const [toggleMedia, setToggleMedia] = useState(false);
  const [toggleTipModal, setToggleTipModal] = useState(false);
  const [toggleUserReport, setToggleUserReport] = useState(false);
  const [toggleConversationMoreOptions, setToggleConversationMoreOptions] = useState(false);
  const [chatStatus, setChatStatus] = useState({
    reportedId: null,
    allow: true,
    msg: <></>
  });
  useEffect(() => {
    setStatus("loading");
    if (!socket) return;
    socket.on(SocketEvent.pong, (data: any) => {
      // console.log(data);
    });
    socket.on(SocketEvent.error, errorHandler);
    socket.on(SocketEvent.jobMessageId, handleUpdatedMessage);
    socket.on(SocketEvent.sendMessage, newMsgHandler);
    socket.on(SocketEvent.createAndStart, handleAddNewChat);
    socket.on(SocketEvent.ReValidateMessage, handleReValidateMessage);
    socket.on(SocketEvent.deleteMessage, handleDeletedMessage);

    if (account) {
      fetchMyContacts();
    }
    return () => {
      socket.off(SocketEvent.jobMessageId, handleUpdatedMessage);
      socket.off(SocketEvent.error, errorHandler);
      socket.off(SocketEvent.sendMessage, newMsgHandler);
      socket.off(SocketEvent.createAndStart, handleAddNewChat);
      socket.off(SocketEvent.ReValidateMessage, handleReValidateMessage);
      socket.off(SocketEvent.deleteMessage, handleDeletedMessage);
    };
  }, [socket]);
  const errorHandler = (error: any) => {
    toast.error(error.msg);
  };

  const handleAddNewChat = ({ msg, data }: any) => {
    if (!data) {
      return;
    }
    console.log("handleAddNewChat", { msg, data })
    setMessages((prevState: any[]) => {

      const exist = prevState.find((d) => d._id == data._id);
      if (exist) return prevState;
      return [data, ...prevState];
    });
    toast.success(msg);
  };
  const newMsgHandler = (data: any) => {
    console.log("newMsgHandler", data)
    setMessages((privState: any) => {
      return privState.map((state: any) => {
        if (state._id === data.conversation) {
          return {
            ...state,
            lastMessageAt: data.createdAt,
            messages: [...(state?.messages || []), data]
          };
        }
        return state;
      });
    });
  };
  const reValidateMessage = (messageId: string, dmId: string) => {
    socket.emit(SocketEvent.ReValidateMessage, { messageId, dmId });
  };

  const handleUnBlock = async (reportId?: string) => {
    if (!account) {
      toast.error("Please connect to your wallet.");
      return;
    }
    console.log('reportId:',reportId)
    try {
      const { success, error, data }: any = await unBlockUser({
        conversationId: message._id,
        address: account.toLowerCase(),
        reportId: reportId ?? ""
      });

      if (!success) {
        toast.error(error || "Failed to unblock the user or conversation.");
        return;
      }

      if (data.unblocked) {
        // Updated to match the API response
        toast.success(data.message);

        // Update the messages state to reflect the unblocked status
        setMessages((prevMessages: any[]) =>
          prevMessages.map((msg) => {
            if (msg._id === message._id) {
              return {
                ...msg,
                blockList: msg.blockList.filter((block: { _id: string }) => {
                  return block._id != data.reportId;
                })
              };
            }
            return msg;
          })
        );
      } else {
        toast.error("Unblock action failed, please try again.");
      }
    } catch (err) {
      // console.error("Error in handleUnBlock:", err);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };
  const blockChatHandler = async (reason: string, userAddress?: string) => {
    if (!account) {
      toast.error("please connect to wallet.");
      return;
    }
    toast.info("blocking...");
    const { data, error }: any = await blockDM({
      conversationId: message._id,
      reason,
      address: account?.toLowerCase(),
      userAddress: userAddress ?? ""
    });
    if (error) {
      toast.error(error);
      return;
    }
    const reportedId = data.reportedId;
    setChatStatus({
      allow: false,
      reportedId: reportedId,
      msg: (
        <div>
          You Block This Chat <Button onClick={()=>{handleUnBlock(reportedId)}}>Un-Block Now</Button>
          </div>
      )
    })
    toast.success(data?.message || data?.msg);
  };
  const fetchMyContacts = async () => {
    try {
      const { data, error, success }: any = await fetchContacts(account, {
        q: null,
        limit: 100,
        skip: 0
      });
      if (!success) {
        toast.error(error);
        return;
      }
      if (!data) {
        return;
      }
      setMessages(data);
      setStatus("success");
    } catch (error: any & { message?: string }) {
      toast.error(error?.message);
      setStatus("error");
    }
  };
  const startNewChat = (user: { address: string; username: string; _id?: string }) => {
    socket.emit(SocketEvent.createAndStart, user);
    toast.success(`please wait starting chat with ${user.username || user.address}`);
  };
  const sendMessage = (content = "", gif = null, type = "msg") => {
    socket.emit(SocketEvent.sendMessage, { content, gif, type, dmId: message?._id });
    setToggleGif(false);
    setToggleEmoji(false);
    setToggleMedia(false);
  };
  const deleteMessage = (messageId: string, dmId: string) => {
    socket.emit(SocketEvent.deleteMessage, { dmId, messageId });
  };
  const handleDeletedMessage = (data: any) => {
    const { dmId, messageId } = data; // Extract dmId and messageId from data

    setMessages((prevState: any) => {
      return prevState.map((state: any) => {
        if (state._id === dmId) {
          // Ensure messages is an array
          const messagesArray = state.messages || [];

          // Filter out the message with the matching messageId
          const updatedMessages = messagesArray.filter(
            (msg: any) => msg._id !== messageId
          );

          // Return the updated state for this dmId
          return {
            ...state,
            messages: updatedMessages,
          };
        }

        return state; // Return state unchanged if dmId doesn't match
      });
    });
  };
  const handleReValidateMessage = (data: any) => {
    const { dmId, message } = data; // Extract dmId and message from data
    setMessages((prevState: any) => {
      return prevState.map((state: any) => {
        if (state._id === dmId) {
          // Ensure messages is an array
          const messagesArray = state.messages || [];

          // Find the index of the existing message in the messages array
          const existingMessageIndex = messagesArray.findIndex(
            (msg: any) => msg._id === message._id
          );

          if (existingMessageIndex !== -1) {
            // Update the existing message
            const updatedMessages = [...messagesArray];
            updatedMessages[existingMessageIndex] = {
              ...updatedMessages[existingMessageIndex],
              ...message // Spread the updated message properties
            };
            return {
              ...state,
              messages: updatedMessages
            };
          } else {
            // Add the new message if it doesn't exist
            return {
              ...state,
              messages: [...messagesArray, message]
            };
          }
        }

        return state; // Return state unchanged if dmId doesn't match
      });
    });
  };
  const handleUpdatedMessage = (data: any) => {
    const { dmId, message } = data;
    setMessages((prevState: any) => {
      return prevState.map((state: any) => {
        if (state._id === dmId) {
          // Ensure messages is an array
          const messagesArray = state.messages || [];

          // Find the index of the existing message in the messages array
          const existingMessageIndex = messagesArray.findIndex(
            (msg: any) => msg._id === message._id
          );

          if (existingMessageIndex !== -1) {
            // Update the existing message
            const updatedMessages = [...messagesArray];
            updatedMessages[existingMessageIndex] = {
              ...updatedMessages[existingMessageIndex],
              ...message // Spread the updated message properties
            };
            return {
              ...state,
              messages: updatedMessages
            };
          } else {
            // Add the new message if it doesn't exist
            return {
              ...state,
              messages: [...messagesArray, message]
            };
          }
        }

        return state; // Return state unchanged if dmId doesn't match
      });
    });
  };
  const handleExitGroup = async(userAddress:string  ) => {
    if(!account)
      return 
     const response = await exitGroup({
          conversationId:message._id,
          address:account,
          userAddress
        });
        if(response.success){
          //@ts-ignore
          toast.success(response.data.message)
          fetchMyContacts();
        }
        if(!response.success){
          toast.success(response.error)
        }
        

  }
  const handleToggleEmoji = () => {
    setToggleEmoji((b) => !b);
    setToggleGif(false);
    setToggleMedia(false);
  };
  const handleToggleGif = () => {
    setToggleGif((b) => !b);
    setToggleEmoji(false);
    setToggleMedia(false);
  };
  const handleToggleMedia = () => {
    setToggleMedia((b) => !b);
    setToggleEmoji(false);
    setToggleGif(false);
  };
  const handleToggleUserReport = () => {
    setToggleUserReport((b) => !b);
  };
  const handleToggleConversationMoreOptions = () => {
    setToggleConversationMoreOptions((b) => !b);
  };
  const handleToggleTipModal = () => {
    setToggleTipModal((b) => !b);
  };
  return (
    <Provider
      chatStatus={chatStatus}
      setChatStatus={setChatStatus}
      me={me}
      messages={messages} // <- From API
      status={status}
      selectedMessageId={selectedMessageId}
      setSelectedMessageId={setSelectedMessageId}
      selectedMessage={message}
      startNewChat={startNewChat}
      sendMessage={sendMessage}
      deleteMessage={deleteMessage}
      socket={socket}
      setMessages={setMessages}
      handleAddNewChat={handleAddNewChat}
      setInput={setInput}
      input={input}
      handleToggleGif={handleToggleGif}
      handleToggleEmoji={handleToggleEmoji}
      handleToggleMedia={handleToggleMedia}
      handleToggleUserReport={handleToggleUserReport}
      handleToggleTipModal={handleToggleTipModal}
      handleToggleConversationMoreOptions={handleToggleConversationMoreOptions}
      toggleTipModal={toggleTipModal}
      toggleEmoji={toggleEmoji}
      toggleGif={toggleGif}
      toggleMedia={toggleMedia}
      toggleUserReport={toggleUserReport}
      toggleConversationMoreOptions={toggleConversationMoreOptions}
      handleUnBlock={handleUnBlock}
      blockChatHandler={blockChatHandler}
      reValidateMessage={reValidateMessage}
      handleExitGroup={handleExitGroup}
      permissions={{}}
    >
      {props.children}
    </Provider>
  );
}

export { useMessage };
