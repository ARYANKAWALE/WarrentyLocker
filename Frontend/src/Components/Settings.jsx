import { useState } from "react";
import { useAuth } from "./AuthContext.jsx";
import { useNavigate, Link } from "react-router-dom";
import gym1 from "../assets/gym1.jpg";
import {
  ChevronRight,
  Moon,
  Star,
  BriefcaseMedical,
  Laptop,
  EllipsisVertical,
  Share2,
  LogOut,
} from "lucide-react";

const BACKEND_URL = "http://localhost:3000/api/v1/settings";

function Settings() {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const [theme, setTheme] = useState("Light");
  const [toggle, setToggle] = useState(false);

  const handleToggle = () => {
    setToggle(!toggle);
    setTheme(theme === "Dark" ? "Light" : "Dark");
  };

  return (
    <div className="w-full bg-[#FBF8FF] flex flex-col flex-grow">
      {isLoggedIn ? (
        <div>
          {/* Left side */}
          <div className="flex-grow border border-gray-300 items-center flex flex-row pt-7 pb-section-gap px-gutter-desktop max-w-[1310px] mx-auto w-full justify-between bg-white rounded-xl my-10">
            <div className="flex w-[320px] justify-around gap-5">
              <div className="flex">
                <img
                  src={gym1}
                  className="w-[100px] h-[100px] rounded-full"
                  alt="profile image"
                />
              </div>
              <div className="w-fit flex flex-col items-center justify-around">
                <p className="font-bold text-3xl">{user?.username}</p>
              </div>
            </div>
            <div className="flex gap-5">
              <div className="px-3 py-2 rounded-lg text-black border border-[#026FEF] bg-gray-50 flex flex-row gap-2">
                <Share2 className="text-[#026FEF]" />
                <button className="text-[#026FEF]">Share stats</button>
              </div>
              <button className="px-5 py-2 rounded-lg bg-blue-500 text-white font-bold cursor-pointer">
                Edit profile
              </button>
            </div>
          </div>
          <div>
            <div className="flex flex-row justify-evenly">
              <div className="flex flex-col gap-5">
                <ul>
                  <li className="p-2 rounded-lg hover:bg-blue-200">
                    <Link>Account details</Link>
                  </li>
                  <li className="p-2 rounded-lg hover:bg-blue-200">
                    Preferences
                  </li>
                  <li className="p-2 rounded-lg hover:bg-blue-200">
                    Privacy & safety
                  </li>
                  <li className="p-2 rounded-lg hover:bg-blue-200">
                    Subscription
                  </li>
                </ul>
                <div className="bg-gray-200 h-[1px] w-full"></div>
                <div className="rounded-lg px-4 justify-center hover:bg-red-200 py-2 text-red-500 cursor-pointer flex flex-row gap-2 items-center">
                  <LogOut />
                  <button onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              </div>

              {/* Right side */}
              <div className="flex flex-col gap-6 w-[50%]">
                <div className="bg-[#F4F2FE] w-full rounded-2xl border border-gray-200">
                  <div className="flex flex-row justify-between px-10 mt-5">
                    <p className="font-medium text-xl">Account Details</p>
                    <p className="bg-[#0057BF] py-1 px-2 rounded-full text-white">
                      Pro
                    </p>
                  </div>

                  <div className="bg-[#F5F4FA] p-6 rounded-xl w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                      <div className="flex flex-col gap-2">
                        <label
                          htmlFor="fullName"
                          className="text-sm font-medium text-gray-500"
                        >
                          Full Name
                        </label>
                        <div className="relative flex items-center">
                          <input
                            id="fullName"
                            type="text"
                            className="w-full bg-white text-gray-800 py-3.5 pl-4 pr-10 rounded-2xl shadow-sm border border-gray-100/50 cursor-pointer outline-none font-medium text-base"
                            value={user?.username || "Username not exist"}
                            readOnly
                          />
                          <span className="absolute right-4 text-gray-400 pointer-events-none text-xs">
                            <ChevronRight />
                          </span>
                        </div>
                      </div>

                      {/* Email Field (Now properly placed inside the grid row) */}
                      <div className="flex flex-col gap-2">
                        <label
                          htmlFor="email"
                          className="text-sm font-medium text-gray-500"
                        >
                          Email
                        </label>
                        <div className="relative flex items-center">
                          <input
                            id="email"
                            type="email"
                            className="w-full bg-white text-gray-800 py-3.5 pl-4 pr-10 rounded-2xl shadow-sm border border-gray-100/50 cursor-pointer outline-none font-medium text-base"
                            value={user?.email || "Email not exist"}
                            readOnly
                          />
                          <span className="absolute right-4 text-gray-400 pointer-events-none text-xs">
                            <ChevronRight />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row items-center justify-between gap-40 p-5 bg-[#D6E1FE] border border-[#BACEFF] m-10 rounded-xl">
                    <div className="flex flex-row items-center gap-2">
                      <div className="">
                        <Star className="p-1 h-14 w-auto rounded-full bg-[#026FEF] text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-[#026FEF]">
                          Elite Annual Plan
                        </p>
                        <p className="text-sm text-[#026FEF]">
                          renew on 1 june 2026
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-[#026FEF]">Manage Plans</p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#F4F2FE] w-full rounded-2xl border border-gray-200">
                  <div className="flex flex-row justify-between px-10 mt-5">
                    <p className="font-medium text-xl">Preferences</p>
                  </div>
                  <div className="p-6">
                    <div className="flex gap-5 flex-col">
                      <div className="flex flex-row items-center justify-between bg-white p-4 rounded-xl">
                        <div className="flex flex-row items-center gap-3">
                          <Moon className="text-[#026FEF]" />
                          <div>
                            <p className="font-medium text-lg">{theme} Mode</p>
                            <p className="text-sm text-gray-500">
                              Switch between light theme & dark themes
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={handleToggle}
                          className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                            toggle ? "bg-[#026FEF]" : "bg-gray-300"
                          }`}
                        >
                          <div
                            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                              toggle ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>
                      <div className="flex flex-row items-center justify-between bg-white p-4 rounded-xl">
                        <div className="flex flex-row items-center gap-3">
                          <BriefcaseMedical className="text-[#026FEF]" />
                          <div>
                            <p className="font-medium text-lg">
                              Health App Integration
                            </p>
                            <p className="text-sm text-gray-500">
                              Sync your metrics with Apple Health or Google Fit
                            </p>
                          </div>
                        </div>
                        <button className="py-1 px-2 rounded-full bg-[#DAD9E4] text-[#474649] text-sm">
                          Soon
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-[#F4F2FE] w-full rounded-2xl border border-gray-200 mb-10">
                  <div className="flex flex-row justify-between px-10 mt-5">
                    <p className="font-medium text-xl">Security & Sessions</p>
                  </div>
                  <div className="p-6">
                    <div className="flex flex-row items-center justify-between bg-white p-4 rounded-xl">
                      <div className="flex flex-row items-center gap-3">
                        <Laptop className="text-[#026FEF] h-12 w-auto p-2 rounded-full bg-[#DFECFF]" />
                        <div>
                          <p className="font-medium text-lg">Your Device</p>
                          <p className="text-sm text-[#026FEF]">
                            Currunt Session
                          </p>
                        </div>
                      </div>
                      <EllipsisVertical />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <p>Please login to view settings</p>
        </div>
      )}
    </div>
  );
}

export default Settings;
