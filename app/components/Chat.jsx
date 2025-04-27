"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MoreVertical } from "lucide-react";

const Chat = ({
  userName,
  imgSrc,
  setCurrentChat,
  bg,
  lastMessage,
  lastMessageTime,
  unreadCount,
}) => {
  const [isImageClicked, setIsImageClicked] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const handleImageClick = () => {
    setIsImageClicked(!isImageClicked);
  };

  const handleLinkClick = () => {
    if (setCurrentChat) {
      setCurrentChat(userName);
      console.log("Setting currentchat to", userName);
    }
  };

  const handleOptionsClick = (e) => {
    e.stopPropagation();
    setShowOptions(!showOptions);
  };

  const bgColor = bg || "bg-[#1A1A1A]";
  const hoverBg = bg ? "" : "hover:bg-[#282828]";

  return (
    <>
      <Link
        href={`/chatPage-${userName}`}
        as={`/${encodeURIComponent(userName)}`}
        passHref
        className={`lg:hidden h-20 ${bgColor} ${hoverBg} flex items-center mb-2 p-3 rounded-lg cursor-pointer shadow-md transition-all duration-200 relative`}
        onClick={handleLinkClick}
      >
        <div className="relative">
          <Image
            src={imgSrc}
            alt="dp"
            width={48}
            height={48}
            className="h-12 w-12 rounded-full flex items-center justify-center object-cover overflow-hidden border-2 border-gray-800"
            quality={100}
            priority={true}
            onClick={handleImageClick}
          />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </div>

        <div className="ml-3 flex-1 overflow-hidden">
          <div className="flex justify-between items-center">
            <h3 className="text-white font-medium truncate">{userName}</h3>
            <span className="text-xs text-gray-500">
              {lastMessageTime || "12:30"}
            </span>
          </div>
          <p className="text-gray-400 text-sm truncate mt-1">
            {lastMessage || "Click to start chatting"}
          </p>
        </div>
      </Link>

      <div
        className={`hidden lg:flex h-20 ${bgColor} ${hoverBg} items-center mb-2 p-3 rounded-lg cursor-pointer shadow-md transition-all duration-200 relative`}
        onClick={handleLinkClick}
      >
        <div className="relative">
          <Image
            src={imgSrc || "/placeholder.svg?height=48&width=48"}
            alt="dp"
            width={48}
            height={48}
            className="h-12 w-12 rounded-full flex items-center justify-center object-cover overflow-hidden border-2 border-gray-800"
            quality={100}
            priority={true}
            onClick={handleImageClick}
          />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </div>

        <div className="ml-3 flex-1 overflow-hidden">
          <div className="flex justify-between items-center">
            <h3 className="text-white font-medium truncate">{userName}</h3>
            <span className="text-xs text-gray-500">
              {lastMessageTime || "12:30"}
            </span>
          </div>
          <p className="text-gray-400 text-sm truncate mt-1">
            {lastMessage || "Click to start chatting"}
          </p>
        </div>

        <button
          className="p-2 rounded-full hover:bg-[#333] transition-colors opacity-0 group-hover:opacity-100"
          onClick={handleOptionsClick}
        >
          <MoreVertical size={18} className="text-gray-400" />
        </button>

        {showOptions && (
          <div className="absolute right-2 top-16 bg-[#282828] rounded-lg shadow-lg z-10 py-1">
            <button className="w-full text-left px-4 py-2 text-sm text-white hover:bg-[#333] transition-colors">
              Pin chat
            </button>
            <button className="w-full text-left px-4 py-2 text-sm text-white hover:bg-[#333] transition-colors">
              Mute notifications
            </button>
            <button className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-[#333] transition-colors">
              Delete chat
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Chat;
