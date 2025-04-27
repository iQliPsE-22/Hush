"use client"
import { useState, useEffect } from "react"
import Chat from "./Chat"
import Link from "next/link"
import { useUser } from "../UserContext"
import Header from "./Header"
import { Plus, Search, Users, Settings, User, X } from "lucide-react"

const Home = () => {
  const { userData, setUserData } = useUser()
  const [friends, setFriends] = useState([])
  const [showSidebar, setShowSidebar] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar)
  }

  const fetchContacts = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("https://server-hush.vercel.app/chats")
      const data = await response.json()

      const filteredContacts = data.filter(
        (contact) => contact.sender === userData.name || contact.recipient === userData.name,
      )

      const uniqueContacts = [
        ...new Set(
          filteredContacts.map((contact) => (contact.sender === userData.name ? contact.recipient : contact.sender)),
        ),
      ]
      console.log("Unique Contacts:", uniqueContacts)
      const friendsList = userData.allusers.filter((friend) => uniqueContacts.includes(friend.name))
      setUserData({ ...userData, myfriends: [...friendsList] })
      setFriends(friendsList)
    } catch (error) {
      console.log("Error fetching contacts:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchContacts()
  }, [userData.name])

  // Add some sample last messages for demo purposes
  const getRandomLastMessage = (index) => {
    const messages = [
      "Hey, how are you?",
      "Did you see that?",
      "Let's meet tomorrow",
      "Thanks for the info!",
      "I'll call you later",
      "Check this out!",
      "Can you help me with something?",
      "What's up?",
      "See you soon!",
      "That's awesome!",
    ]
    return messages[index % messages.length]
  }

  return (
    <div className="flex flex-col h-screen bg-black">
      <Header toggleSidebar={toggleSidebar} />

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 bg-black z-50 transform ${showSidebar ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 lg:hidden`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-800">
          <h2 className="font-semibold text-lg">Menu</h2>
          <button onClick={toggleSidebar} className="p-2 rounded-full hover:bg-[#282828]">
            <X size={24} />
          </button>
        </div>

        <div className="p-4">
          <Link href="/profile" className="flex items-center p-3 rounded-lg hover:bg-[#1A1A1A]">
            <User size={20} className="mr-3" />
            <span>Profile</span>
          </Link>
          <Link href="/search" className="flex items-center p-3 rounded-lg hover:bg-[#1A1A1A]">
            <Users size={20} className="mr-3" />
            <span>New Chat</span>
          </Link>
          <Link href="/settings" className="flex items-center p-3 rounded-lg hover:bg-[#1A1A1A]">
            <Settings size={20} className="mr-3" />
            <span>Settings</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Search Bar - Mobile Only */}
        <div className="p-4 lg:hidden">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-3.5 text-gray-500" />
            <input
              type="text"
              className="w-full h-12 pl-10 pr-4 text-white bg-[#1A1A1A] border-none outline-none rounded-lg placeholder-gray-500"
              placeholder="Search conversations..."
            />
          </div>
        </div>

        {/* Chats List */}
        <div className="px-4 overflow-y-auto pb-20" style={{ maxHeight: "calc(100vh - 180px)" }}>
          <h2 className="text-lg font-semibold mb-3 text-white">Recent Chats</h2>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse flex p-3 bg-[#1A1A1A] rounded-lg">
                  <div className="rounded-full bg-gray-700 h-12 w-12"></div>
                  <div className="ml-3 flex-1">
                    <div className="h-2.5 bg-gray-700 rounded-full w-24 mb-2.5"></div>
                    <div className="h-2 bg-gray-700 rounded-full w-32"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : friends.length > 0 ? (
            friends.map((contact, index) => (
              <Chat
                key={contact._id || index}
                userName={contact.name}
                imgSrc={contact.profilePicture}
                lastMessage={getRandomLastMessage(index)}
                lastMessageTime={`${Math.floor(Math.random() * 12 + 1)}:${Math.floor(Math.random() * 60)
                  .toString()
                  .padStart(2, "0")}`}
                unreadCount={Math.random() > 0.7 ? Math.floor(Math.random() * 5 + 1) : 0}
              />
            ))
          ) : (
            <div className="text-center py-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#1A1A1A] mb-4">
                <Users size={32} className="text-gray-400" />
              </div>
              <h3 className="text-white font-medium mb-2">No conversations yet</h3>
              <p className="text-gray-500 text-sm mb-4">Start chatting with your friends</p>
              <Link href="/search">
                <button className="bg-rose-500 hover:bg-rose-600 text-white py-2 px-4 rounded-lg transition-colors">
                  Find Friends
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <Link href="/search">
        <button className="fixed right-6 bottom-6 bg-rose-500 hover:bg-rose-600 text-white p-4 rounded-full shadow-lg transition-colors">
          <Plus size={24} />
        </button>
      </Link>
    </div>
  )
}

export default Home
