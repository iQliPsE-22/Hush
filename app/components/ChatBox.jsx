"use client";

import { useState } from "react";
import { Heart, ThumbsUp, CheckCheck } from "lucide-react";
import "./chatBox.css";

const ChatBox = ({ msg, sender }) => {
  const [reaction, setReaction] = useState(null);
  const isEmoji = msg.message.match(/\p{Emoji}/gu);
  const isSender = msg.sender === sender;

  const handleReaction = (type) => {
    setReaction(type);
  };

  return (
    <div className="text-white w-full my-1.5 flex flex-col items-start animate-fadeIn">
      <div
        className={`text-box break-words w-fit block min-h-fit relative p-3 shadow-md ${
          isSender
            ? "border-l-4 border-rose-500 self-end rounded-l-lg rounded-b-lg bg-[#1E1E1E]"
            : "border-l-4 border-green-500 self-start rounded-r-lg rounded-t-lg bg-[#1A1A1A]"
        }`}
      >
        <h1
          className={`${isEmoji ? "text-4xl" : "text-sm"} ${
            isSender ? "text-gray-100" : "text-gray-200"
          }`}
        >
          {msg.message}
        </h1>
        <div className="w-full flex justify-between items-center mt-1">
          <span className="text-xs text-gray-500">{msg.time}</span>
          {isSender && (
            <span className="text-xs text-gray-500 ml-2 flex items-center">
              <CheckCheck size={14} className="text-green-500" />
            </span>
          )}
        </div>

        {reaction && (
          <div className="absolute -bottom-2 right-2 bg-gray-800 rounded-full p-1 shadow-lg">
            {reaction === "heart" && (
              <Heart size={12} className="text-red-500" />
            )}
            {reaction === "thumbs" && (
              <ThumbsUp size={12} className="text-blue-500" />
            )}
          </div>
        )}
      </div>

      {!isSender && (
        <div className="flex space-x-1 ml-2 mt-1 opacity-70">
          <button
            onClick={() => handleReaction("heart")}
            className="p-1 rounded-full hover:bg-gray-800 transition-colors"
          >
            <Heart size={14} className="text-red-500" />
          </button>
          <button
            onClick={() => handleReaction("thumbs")}
            className="p-1 rounded-full hover:bg-gray-800 transition-colors"
          >
            <ThumbsUp size={14} className="text-blue-500" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
