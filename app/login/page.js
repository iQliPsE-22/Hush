"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "../UserContext";
import Loading from "../components/Loading";
import { jwtDecode } from "jwt-decode";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import "./login.css";

const Button = dynamic(() => import("../components/Button"), { ssr: false });

const Page = () => {
  const router = useRouter();
  const { userData, setUserData } = useUser();
  const [showLoading, setShowLoading] = useState(false);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setError("");
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setShowLoading(true);
    setError("");

    try {
      const response = await fetch("https://server-hush.vercel.app/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      const decodedToken = jwtDecode(data.token);
      setUserData(decodedToken);

      await fetchAllContacts();
      router.push("/");
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.message);
    } finally {
      setShowLoading(false);
    }
  };

  const fetchAllContacts = async () => {
    try {
      const response = await fetch("https://server-hush.vercel.app/search");
      if (!response.ok) throw new Error("Failed to fetch contacts");

      const data = await response.json();
      const updatedFriends = data.map((friend) => {
        if (friend.profilePicture) {
          const cachedImage = localStorage.getItem(`profile-${friend._id}`);
          if (cachedImage) {
            // Use cached image
            friend.profilePicture = cachedImage;
          } else {
            // Convert binary data to base64 and store in localStorage
            const base64Image = `data:${
              friend.profilePicture.contentType
            };base64,${Buffer.from(friend.profilePicture.data.data).toString(
              "base64"
            )}`;

            localStorage.setItem(`profile-${friend._id}`, base64Image);
            friend.profilePicture = base64Image;
          }
        }
        return friend;
      });

      setUserData((prev) => ({ ...prev, allusers: updatedFriends }));
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      {showLoading && <Loading />}
      {!showLoading && (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black p-4">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <Image
                src={"/whisper.svg" || "/placeholder.svg"}
                alt="Hush Logo"
                width={80}
                height={80}
                className="mx-auto mb-4"
              />
              <h1 className="text-2xl font-bold text-white mb-2" id="title">
                Welcome Back
              </h1>
              <p className="text-gray-400">Sign in to continue to Hush</p>
            </div>

            <form className="space-y-6" onSubmit={handleFormSubmit}>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-400 mb-1"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={18} className="text-gray-500" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      className="bg-[#1A1A1A] text-white w-full pl-10 pr-3 py-3 rounded-lg border border-gray-800 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-colors"
                      placeholder="Enter your email"
                      value={credentials.email}
                      onChange={(e) =>
                        setCredentials((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-400 mb-1"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={18} className="text-gray-500" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      className="bg-[#1A1A1A] text-white w-full pl-10 pr-10 py-3 rounded-lg border border-gray-800 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-colors"
                      placeholder="Enter your password"
                      value={credentials.password}
                      onChange={(e) =>
                        setCredentials((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? (
                        <EyeOff
                          size={18}
                          className="text-gray-500 hover:text-gray-300"
                        />
                      ) : (
                        <Eye
                          size={18}
                          className="text-gray-500 hover:text-gray-300"
                        />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-900/30 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  className="w-full bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  Sign In
                </button>
              </div>

              <div className="text-center">
                <Link
                  href="#"
                  className="text-sm text-gray-400 hover:text-rose-500 transition-colors"
                >
                  Forgot your password?
                </Link>
              </div>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-400">
                Don`&apos;`t have an account?{" "}
                <Link
                  href="/signup"
                  className="text-rose-500 hover:text-rose-400 font-medium transition-colors"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Page;
