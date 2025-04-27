"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import io from "socket.io-client";
import { useUser } from "../UserContext";
import ChatBox from "./../components/ChatBox";
import {
  Send,
  Smile,
  Paperclip,
  ArrowLeft,
  MoreVertical,
  Phone,
  Video,
} from "lucide-react";
import Image from "next/image";

const Chatpage = ({ currentChat }) => {
  const router = useRouter();
  const { userData } = useUser();
  const [friend, setFriend] = useState({});
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const sender = userData.name || "";
  const recipient = currentChat;

  useEffect(() => {
    const newSocket = io("https://hush-server.onrender.com", {
      transports: ["websocket", "polling", "flashsocket"],
    });

    setSocket(newSocket);

    newSocket.on("connect", () => console.log("Connected to the server!"));
    newSocket.on("disconnect", () =>
      console.log("Disconnected from the server!")
    );

    // Simulate online status
    setIsOnline(Math.random() > 0.3);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket || !recipient) return;

    setIsLoading(true);
    socket.emit("fetch messages", { sender, recipient });

    const handleFetchedMessages = (fetchedMessages) => {
      console.log("Messages fetched:", fetchedMessages);
      setMessages(fetchedMessages);
      setIsLoading(false);
    };

    socket.on("messages fetched", handleFetchedMessages);

    // Simulate typing indicator randomly
    const typingInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 3000);
      }
    }, 10000);

    return () => {
      socket.off("messages fetched", handleFetchedMessages);
      clearInterval(typingInterval);
    };
  }, [socket, recipient]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg) => {
      console.log("Message received:", msg);
      setMessages((prevMessages) => [...prevMessages, msg]);
      setIsTyping(false);
    };

    socket.on("chat message", handleNewMessage);

    return () => socket.off("chat message", handleNewMessage);
  }, [socket]);

  useEffect(() => {
    const friendData = userData?.allusers?.find(
      (friend) => friend.name === recipient
    );
    console.log("friend Data", friendData);
    setFriend(friendData || {});
  }, [userData, recipient]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleMessages = (e) => {
    e.preventDefault();
    if (!socket || !inputMessage.trim()) return;

    const date = new Date();
    const time = `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

    const newMessage = {
      message: inputMessage.trim(),
      sender,
      recipient,
      time,
    };

    socket.emit("chat message", newMessage);
    setInputMessage("");
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleBackClick = () => {
    router.push("/");
  };

  const groupMessagesByDate = () => {
    const groups = {};
    messages.forEach((msg) => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      let dateLabel = "Older Messages";
      if (msg.date) {
        const msgDate = new Date(msg.date);
        if (msgDate.toDateString() === today.toDateString()) {
          dateLabel = "Today";
        } else if (msgDate.toDateString() === yesterday.toDateString()) {
          dateLabel = "Yesterday";
        }
      }

      if (!groups[dateLabel]) {
        groups[dateLabel] = [];
      }
      groups[dateLabel].push(msg);
    });
    return groups;
  };

  const groupedMessages = groupMessagesByDate();

  return (
    <section className="lg:p-2 pb-0 flex flex-col h-full">
      {/* Chat Header */}
      <div className="bg-[#1A1A1A] p-3 flex items-center justify-between sticky top-0 z-0 shadow-md">
        <div className="flex items-center">
          <button
            onClick={handleBackClick}
            className="lg:hidden mr-2 p-2 rounded-full hover:bg-[#282828] transition-colors"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="flex items-center">
            <div className="relative">
              <Image
                src={
                  friend?.profilePicture ||
                  "/placeholder.svg?height=40&width=40"
                }
                alt="dp"
                width={40}
                height={40}
                className="h-10 w-10 rounded-full object-cover"
                quality={100}
                priority={true}
              />
              {isOnline && (
                <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-[#1A1A1A]"></span>
              )}
            </div>
            <div className="ml-3">
              <h3 className="text-white font-medium">{friend?.name}</h3>
              <p className="text-xs text-gray-400">
                {isOnline ? (isTyping ? "typing..." : "online") : "offline"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button className="p-2 rounded-full hover:bg-[#282828] transition-colors">
            <Phone size={20} />
          </button>
          <button className="p-2 rounded-full hover:bg-[#282828] transition-colors">
            <Video size={20} />
          </button>
          <button className="p-2 rounded-full hover:bg-[#282828] transition-colors">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div
        className="flex-1 overflow-y-auto p-4 pb-20 space-y-4"
        ref={chatContainerRef}
      >
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-2.5 bg-gray-700 rounded-full w-48 mb-4"></div>
              <div className="h-2 bg-gray-700 rounded-full w-32 mb-2.5"></div>
              <div className="h-2 bg-gray-700 rounded-full w-40"></div>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p className="text-center mb-2">No messages yet</p>
            <p className="text-center text-sm">
              Start the conversation with {friend?.name}
            </p>
          </div>
        ) : (
          Object.entries(groupedMessages).map(([date, msgs]) => (
            <div key={date} className="space-y-2">
              <div className="flex justify-center">
                <span className="text-xs bg-gray-800 text-gray-400 px-3 py-1 rounded-full">
                  {date}
                </span>
              </div>
              {msgs.map((msg, index) => (
                <ChatBox key={index} msg={msg} sender={sender} />
              ))}
            </div>
          ))
        )}

        {isTyping && (
          <div className="flex items-start ml-4 animate-pulse">
            <div className="bg-[#282828] rounded-lg p-3 inline-flex space-x-1">
              <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
              <span
                className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></span>
              <span
                className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.4s" }}
              ></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form
        onSubmit={handleMessages}
        className="w-full lg:w-full fixed bottom-0 p-3 gap-2 flex flex-row bg-[#1A1A1A] border-t border-gray-800 shadow-lg"
      >
        <button
          type="button"
          className="p-2 rounded-full hover:bg-[#282828] transition-colors text-gray-400"
        >
          <Paperclip size={20} />
        </button>

        <input
          type="text"
          className="w-full h-12 p-3 text-white bg-[#282828] border-none outline-none rounded-lg placeholder-gray-500"
          placeholder="Type a message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        />

        <button
          type="button"
          className="p-2 rounded-full hover:bg-[#282828] transition-colors text-gray-400"
        >
          <Smile size={20} />
        </button>

        <button
          type="submit"
          className={`p-3 rounded-full ${
            inputMessage.trim()
              ? "bg-rose-500 text-white"
              : "bg-[#282828] text-gray-500"
          } transition-colors`}
          disabled={!inputMessage.trim()}
        >
          <Send size={20} />
        </button>
      </form>
    </section>
  );
};

export default Chatpage;
