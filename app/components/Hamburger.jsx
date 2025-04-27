"use client";
import { useState, useEffect } from "react";
import { useUser } from "../UserContext";
import Chat from "./Chat";
import { Search, Plus, Settings, Bell } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Hamburger = ({ setCurrentChat }) => {
  const [keyword, setKeyword] = useState("");
  const { userData } = useUser();
  const [filteredFriends, setFilteredFriends] = useState(
    userData.allusers || []
  );
  const [activeTab, setActiveTab] = useState("chats");
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    if (userData?.profilePicture?.data) {
      const uint8Array = new Uint8Array(userData.profilePicture.data.data);
      const base64String = btoa(String.fromCharCode(...uint8Array));
      const imageSrc = `data:${userData.profilePicture.contentType};base64,${base64String}`;
      setProfilePicture(imageSrc);
    }
  }, [userData]);

  useEffect(() => {
    if (keyword.trim() === "") {
      setFilteredFriends(userData.allusers);
    } else {
      const results = userData.allusers.filter((friend) =>
        friend.name.toLowerCase().includes(keyword.toLowerCase())
      );
      setFilteredFriends(results);
    }
  }, [keyword, userData.allusers]);

  return (
    <div className="h-dvh w-full bg-black text-white flex flex-col">
      {/* Header */}
      <div className="p-4 flex justify-between items-center border-b border-gray-800">
        <div className="flex items-center">
          <Link href="/profile">
            <Image
              src={profilePicture}
              alt="profile"
              width={40}
              height={40}
              className="rounded-full border border-gray-700"
            />
          </Link>
          <h2 className="ml-3 font-medium">{userData.name}</h2>
        </div>
        <div className="flex space-x-2">
          <button className="p-2 rounded-full hover:bg-[#282828] transition-colors">
            <Bell size={20} />
          </button>
          <button className="p-2 rounded-full hover:bg-[#282828] transition-colors">
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800">
        <button
          className={`flex-1 py-3 text-sm font-medium ${
            activeTab === "chats"
              ? "text-rose-500 border-b-2 border-rose-500"
              : "text-gray-400"
          }`}
          onClick={() => setActiveTab("chats")}
        >
          Chats
        </button>
        <button
          className={`flex-1 py-3 text-sm font-medium ${
            activeTab === "groups"
              ? "text-rose-500 border-b-2 border-rose-500"
              : "text-gray-400"
          }`}
          onClick={() => setActiveTab("groups")}
        >
          Groups
        </button>
        <button
          className={`flex-1 py-3 text-sm font-medium ${
            activeTab === "calls"
              ? "text-rose-500 border-b-2 border-rose-500"
              : "text-gray-400"
          }`}
          onClick={() => setActiveTab("calls")}
        >
          Calls
        </button>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-3.5 text-gray-500" />
          <input
            type="text"
            className="w-full h-12 pl-10 pr-4 text-white bg-[#1A1A1A] border-none outline-none rounded-lg placeholder-gray-500"
            placeholder="Search conversations..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto px-4">
        {activeTab === "chats" && (
          <>
            {filteredFriends.length > 0 ? (
              filteredFriends.map((friend, index) => (
                <Chat
                  key={friend._id || index}
                  imgSrc={friend.profilePicture}
                  userName={friend.name}
                  setCurrentChat={setCurrentChat}
                  unreadCount={
                    Math.random() > 0.7 ? Math.floor(Math.random() * 5 + 1) : 0
                  }
                />
              ))
            ) : (
              <div className="text-center text-gray-500 mt-8">
                <p className="mb-2">No conversations found</p>
                <p className="text-sm">Try a different search term</p>
              </div>
            )}
          </>
        )}

        {activeTab === "groups" && (
          <div className="text-center text-gray-500 mt-8">
            <p className="mb-2">No groups yet</p>
            <button className="mt-2 flex items-center justify-center mx-auto text-rose-500">
              <Plus size={18} className="mr-1" /> Create a group
            </button>
          </div>
        )}

        {activeTab === "calls" && (
          <div className="text-center text-gray-500 mt-8">
            <p className="mb-2">No recent calls</p>
            <p className="text-sm">Start a conversation to call</p>
          </div>
        )}
      </div>

      {/* New Chat Button */}
      <div className="p-4 border-t border-gray-800">
        <Link href="/search">
          <button className="w-full bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center">
            <Plus size={20} className="mr-2" /> New Chat
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Hamburger;
