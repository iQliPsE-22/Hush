"use client"
import { useState } from "react"
import { useUser } from "./UserContext"
import Header from "./components/Header"
import Hamburger from "./components/Hamburger"
import Chatpage from "./components/Chatpage"
import Home from "./components/Home"
import Loading from "./components/Loading"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

const Page = () => {
  const { userData } = useUser()
  const [currentChat, setCurrentChat] = useState("")

  const router = useRouter()

  useEffect(() => {
    if (userData.name === "") {
      router.push("/login")
    }
  }, [userData.name])

  return (
    <>
      {userData.name === "" ? (
        <Loading />
      ) : (
        <main className="flex min-h-screen w-screen overflow-hidden">
          <aside className="w-[27%] h-screen fixed top-0 left-0 lg:block hidden">
            <Hamburger setCurrentChat={setCurrentChat} />
          </aside>

          <section className="hidden lg:flex flex-col flex-1 lg:ml-[27%] h-screen overflow-y-auto">
            <Header />
            {currentChat === "" ? (
              <div className="flex items-center justify-center h-full">
                <h1 className="text-gray-400 text-lg">Start a new Chat</h1>
              </div>
            ) : (
              <Chatpage currentChat={currentChat} />
            )}
          </section>
          <section className="w-full block lg:hidden">
            <Home />
          </section>
        </main>
      )}
    </>
  )
}

export default Page
