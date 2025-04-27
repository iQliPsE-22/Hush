"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useUser } from "../UserContext";
import Header from "./../components/Header";
import {
  Camera,
  Edit,
  LogOut,
  Shield,
  Bell,
  Moon,
  HelpCircle,
  User,
  Globe,
} from "lucide-react";
import Link from "next/link";

const ProfilePage = () => {
  const { userData } = useUser();
  const [profilePicture, setProfilePicture] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  useEffect(() => {
    if (userData?.profilePicture?.data) {
      const uint8Array = new Uint8Array(userData.profilePicture.data.data);
      const base64String = btoa(String.fromCharCode(...uint8Array));
      const imageSrc = `data:${userData.profilePicture.contentType};base64,${base64String}`;
      setProfilePicture(imageSrc);
    }
  }, [userData]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black">
      <Header toggleSidebar={toggleSidebar} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-[#1A1A1A] rounded-xl p-6 mb-6 shadow-lg">
          <div className="flex flex-col md:flex-row items-center">
            <div className="relative mb-4 md:mb-0">
              <div className="relative h-24 w-24 md:h-32 md:w-32 rounded-full overflow-hidden border-4 border-gray-800">
                {profilePicture ? (
                  <Image
                    src={profilePicture || "/placeholder.svg"}
                    alt="User Profile"
                    fill
                    className="object-cover"
                    priority
                    quality={90}
                  />
                ) : (
                  <Image
                    src="/placeholder.svg?height=128&width=128"
                    alt="Default Profile"
                    fill
                    className="object-cover"
                    priority
                  />
                )}
              </div>
              <button className="absolute bottom-0 right-0 bg-rose-500 text-white p-2 rounded-full shadow-lg hover:bg-rose-600 transition-colors">
                <Camera size={16} />
              </button>
            </div>

            <div className="md:ml-6 text-center md:text-left">
              <h1 className="text-2xl font-bold text-white mb-1">
                {userData.name}
              </h1>
              <p className="text-gray-400 mb-3">{userData.email}</p>
              <button className="inline-flex items-center bg-[#282828] hover:bg-[#333] text-white px-4 py-2 rounded-lg transition-colors">
                <Edit size={16} className="mr-2" /> Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Profile Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#1A1A1A] rounded-xl p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-white mb-4">
              Account Settings
            </h2>

            <div className="space-y-4">
              <Link
                href="/settings/profile"
                className="flex items-center p-3 rounded-lg hover:bg-[#282828] transition-colors"
              >
                <div className="bg-[#282828] p-2 rounded-lg mr-3">
                  <User size={20} className="text-rose-500" />
                </div>
                <div>
                  <h3 className="text-white font-medium">
                    Personal Information
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Update your personal details
                  </p>
                </div>
              </Link>

              <Link
                href="/settings/privacy"
                className="flex items-center p-3 rounded-lg hover:bg-[#282828] transition-colors"
              >
                <div className="bg-[#282828] p-2 rounded-lg mr-3">
                  <Shield size={20} className="text-rose-500" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Privacy & Security</h3>
                  <p className="text-gray-400 text-sm">
                    Manage your privacy settings
                  </p>
                </div>
              </Link>

              <Link
                href="/settings/notifications"
                className="flex items-center p-3 rounded-lg hover:bg-[#282828] transition-colors"
              >
                <div className="bg-[#282828] p-2 rounded-lg mr-3">
                  <Bell size={20} className="text-rose-500" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Notifications</h3>
                  <p className="text-gray-400 text-sm">
                    Configure notification preferences
                  </p>
                </div>
              </Link>
            </div>
          </div>

          <div className="bg-[#1A1A1A] rounded-xl p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-white mb-4">
              Preferences
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-[#282828] transition-colors">
                <div className="flex items-center">
                  <div className="bg-[#282828] p-2 rounded-lg mr-3">
                    <Moon size={20} className="text-rose-500" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Dark Mode</h3>
                    <p className="text-gray-400 text-sm">
                      Toggle dark/light theme
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    value=""
                    className="sr-only peer"
                    checked
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
                </label>
              </div>

              <Link
                href="/settings/language"
                className="flex items-center p-3 rounded-lg hover:bg-[#282828] transition-colors"
              >
                <div className="bg-[#282828] p-2 rounded-lg mr-3">
                  <Globe size={20} className="text-rose-500" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Language</h3>
                  <p className="text-gray-400 text-sm">
                    Change application language
                  </p>
                </div>
              </Link>

              <Link
                href="/help"
                className="flex items-center p-3 rounded-lg hover:bg-[#282828] transition-colors"
              >
                <div className="bg-[#282828] p-2 rounded-lg mr-3">
                  <HelpCircle size={20} className="text-rose-500" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Help & Support</h3>
                  <p className="text-gray-400 text-sm">Get help with Hush</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="mt-6 text-center">
          <Link
            className="inline-flex items-center bg-[#1A1A1A] hover:bg-[#282828] text-red-500 px-6 py-3 rounded-lg transition-colors"
            href="/login"
          >
            <LogOut size={18} className="mr-2" /> Sign Out
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
