"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, Search, Bell, Moon, User, Settings } from "lucide-react";
import { useUser } from "../UserContext";

const Header = ({ toggleSidebar }) => {
  const { userData } = useUser();
  const [profileImage, setProfileImage] = useState("/profile.svg"); // Default profile image
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (userData?.profilePicture?.data?.data) {
      const byteArray = new Uint8Array(userData.profilePicture.data.data);
      const blob = new Blob([byteArray], {
        type: userData.profilePicture.contentType || "image/jpeg",
      });
      const imageUrl = URL.createObjectURL(blob);

      setProfileImage(imageUrl);

      return () => URL.revokeObjectURL(imageUrl);
    }
  }, [userData?.profilePicture]);

  const handleProfileClick = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="bg-black sticky top-0 z-10">
      <div className="flex justify-between items-center p-3 border-b border-gray-800">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-full hover:bg-[#282828] transition-colors"
          >
            <Menu size={22} className="text-white" />
          </button>

          <Link href="/" className="flex items-center ml-2">
            <Image
              src="/whisper.svg"
              alt="logo"
              height={36}
              width={36}
              quality={100}
              className="rounded-full"
            />
            <span className="ml-2 font-semibold text-lg hidden sm:block">
              Hush
            </span>
          </Link>
        </div>

        <div className="hidden md:flex items-center bg-[#1A1A1A] rounded-full px-3 py-1.5 flex-1 max-w-md mx-4">
          <Search size={18} className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent border-none outline-none text-white w-full"
          />
        </div>

        <div className="flex items-center space-x-1">
          <button className="p-2 rounded-full hover:bg-[#282828] transition-colors">
            <Bell size={20} className="text-white" />
          </button>
          <button className="p-2 rounded-full hover:bg-[#282828] transition-colors">
            <Moon size={20} className="text-white" />
          </button>

          <div className="relative">
            <button
              onClick={handleProfileClick}
              className="relative h-9 w-9 rounded-full overflow-hidden border border-gray-700 hover:border-gray-500 transition-colors"
            >
              <Image
                src={profileImage || "/placeholder.svg"}
                alt="profile"
                fill
                className="object-cover"
                quality={90}
              />
            </button>

            {showDropdown && (
              <div className="absolute right-0 z-20 mt-2 w-48 bg-[#1A1A1A] rounded-lg shadow-lg py-1">
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-sm text-white hover:bg-[#282828]"
                >
                  <User size={16} className="inline mr-2" /> Profile
                </Link>
                <Link
                  href="/settings"
                  className="block px-4 py-2 text-sm text-white hover:bg-[#282828]"
                >
                  <Settings size={16} className="inline mr-2" /> Settings
                </Link>
                <hr className="border-gray-800 my-1" />
                <Link
                  href="/login"
                  className="block w-full px-4 py-2 text-sm text-red-500 hover:bg-[#282828]"
                >
                  Log out
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
