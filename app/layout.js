import { Inter, Julius_Sans_One, Itim } from "next/font/google"
import "./globals.css"
import { UserProvider } from "./UserContext"

// Configure the Inter font
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
})

// Configure the Julius Sans One font
const julius = Julius_Sans_One({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-julius",
  weight: ["400"],
})

// Configure the Itim font
const itim = Itim({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-itim",
  weight: ["400"],
})

export const metadata = {
  title: "Hush",
  description: "A secure messaging application",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${julius.variable} ${itim.variable} font-sans`}>
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  )
}
