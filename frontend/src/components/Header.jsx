import { Search, Menu } from "lucide-react";
import React, { useState, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { MdOutlineHelp } from "react-icons/md";
import { BiSolidSquareRounded } from "react-icons/bi";

const Header = ({ onToggleSidebar, onSearch, theme, toggleTheme }) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileData, setProfileData] = useState(null);
  const token = localStorage.getItem("token");
  const userId = JSON.parse(localStorage.getItem("user"))?.id;
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8001/api/user/getuserbyid/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch profile data");

        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, [userId, token]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  const handleProfileToggle = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    console.log("logout");
  };

  const avatarUrl =
    profileData?.BusinessId?.image || "https://via.placeholder.com/40";

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 p-2 flex items-center justify-between transition-colors duration-300 z-20 bg-white dark:bg-[#17191A]">
      <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-2 w-80">
        <div className="text-xl text-gray-700 dark:text-gray-300">
          <CiSearch />
        </div>
        <input
          type="text"
          placeholder="Search"
          className="bg-transparent pl-2 text-lg outline-none w-full dark:text-gray-300"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="block lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
          aria-label="Toggle Menu"
        >
          <Menu className="h-6 w-6 dark:text-white" />
        </button>

        <div className="flex items-center">
          <div className="relative">
            <button
              onClick={handleProfileToggle}
              className="flex items-center space-x-2"
            >
              <img
                src={avatarUrl}
                alt="Profile Avatar"
                className="w-10 h-10 rounded-full border border-gray-300"
              />
              <FaChevronDown className="text-xl dark:text-white" />
            </button>
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg border bg-white dark:bg-gray-800">
                <Link
                  to="/user/userprofilepage"
                  onClick={handleProfileToggle}
                  className="block px-4 py-2 hover:bg-opacity-75 dark:text-white"
                >
                  View Profile
                </Link>
                <Link
                  to="/"
                  onClick={handleLogout}
                  className="block px-4 py-2 hover:bg-opacity-75 dark:text-white"
                >
                  Log Out
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
