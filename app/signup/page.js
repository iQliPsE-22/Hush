"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Upload, Eye, EyeOff } from "lucide-react";
import imageCompression from "browser-image-compression";
import Loading from "./../components/Loading";
import "../login/login.css";

const InputField = ({
  id,
  type,
  icon: Icon,
  placeholder,
  value,
  onChange,
  required,
}) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-400 mb-1"
    >
      {placeholder}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon size={18} className="text-gray-500" />
      </div>
      <input
        id={id}
        type={type}
        className="bg-[#1A1A1A] text-white w-full pl-10 pr-3 py-3 rounded-lg border border-gray-800 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-colors"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        aria-label={placeholder}
      />
    </div>
  </div>
);

const ProfilePictureUploader = ({
  previewImage,
  dragActive,
  onDrag,
  onDrop,
  onChange,
}) => (
  <div className="flex flex-col items-center">
    <div
      className={`relative w-24 h-24 rounded-full overflow-hidden border-2 ${
        dragActive ? "border-rose-500 border-dashed" : "border-gray-700"
      } mb-3`}
      onDragEnter={onDrag}
      onDragLeave={onDrag}
      onDragOver={onDrag}
      onDrop={onDrop}
    >
      {previewImage ? (
        <Image
          src={URL.createObjectURL(previewImage)}
          alt="Profile Preview"
          fill
          className="object-cover"
        />
      ) : (
        <Image
          src="/profile.jpg"
          alt="Default Profile"
          fill
          className="object-cover"
        />
      )}
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
        <Upload size={24} className="text-white" />
      </div>
    </div>
    <label
      htmlFor="profile-upload"
      className="cursor-pointer text-sm text-rose-500 hover:text-rose-400 transition-colors"
    >
      Upload Photo
    </label>
    <input
      id="profile-upload"
      type="file"
      accept="image/*"
      className="hidden"
      onChange={onChange}
      required
    />
  </div>
);

const Page = () => {
  const [user, setUser] = useState({
    profilePicture: null,
    name: "",
    email: "",
    password: "",
  });
  const router = useRouter();
  const [previewImage, setPreviewImage] = useState(null);
  const [message, setMessage] = useState("");
  const [showLoading, setShowLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setShowLoading(true);
      const formData = new FormData();
      formData.append("profilePicture", user.profilePicture);
      formData.append("name", user.name);
      formData.append("email", user.email);
      formData.append("password", user.password);

      const response = await fetch("https://server-hush.vercel.app/user", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (response.ok) {
        router.push("/login");
      } else {
        setMessage(data.message || "An error occurred");
      }
    } catch (err) {
      setMessage("Failed to create account. Please try again.");
    } finally {
      setShowLoading(false);
    }
  };

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      await processImage(file);
    }
  };

  const processImage = async (file) => {
    const options = {
      maxSizeMB: 0.05,
      maxWidthOrHeight: 800,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(file, options);
      setPreviewImage(compressedFile);
      setUser((prevUser) => ({
        ...prevUser,
        profilePicture: compressedFile,
      }));
    } catch (error) {
      console.error("Error compressing the image:", error);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processImage(e.dataTransfer.files[0]);
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
            <div className="text-center mb-6">
              <Image
                src={"/whisper.svg" || "/placeholder.svg"}
                alt="Hush Logo"
                width={80}
                height={80}
                className="mx-auto mb-4"
              />
              <h1 className="text-2xl font-bold text-white mb-2" id="title">
                Create Account
              </h1>
              <p className="text-gray-400">Join Hush and start chatting</p>
            </div>

            <form className="space-y-6" onSubmit={handleFormSubmit}>
              <ProfilePictureUploader
                previewImage={previewImage}
                dragActive={dragActive}
                onDrag={handleDrag}
                onDrop={handleDrop}
                onChange={handleProfilePictureChange}
              />

              <div className="space-y-4">
                <InputField
                  id="name"
                  type="text"
                  icon={User}
                  placeholder="Username"
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  required
                />
                <InputField
                  id="email"
                  type="email"
                  icon={Mail}
                  placeholder="Email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  required
                />
                <InputField
                  id="password"
                  type={showPassword ? "text" : "password"}
                  icon={Lock}
                  placeholder="Password"
                  value={user.password}
                  onChange={(e) =>
                    setUser({ ...user, password: e.target.value })
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

              {message && (
                <div className="bg-red-900/30 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg">
                  {message}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  className="w-full bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  Create Account
                </button>
              </div>

              <div className="text-center text-sm text-gray-400">
                By signing up, you agree to our{" "}
                <Link href="#" className="text-rose-500 hover:text-rose-400">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="#" className="text-rose-500 hover:text-rose-400">
                  Privacy Policy
                </Link>
              </div>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-400">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-rose-500 hover:text-rose-400 font-medium transition-colors"
                >
                  Sign In
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
