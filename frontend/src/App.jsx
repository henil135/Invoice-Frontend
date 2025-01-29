import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Login from "./components/Login";
import SignUp from "./components/Signup";
import ForgetPassword from "./components/ForgetPassword";
import { UserPanel } from "./pages/User/UserPanel";
import { AdminPanel } from "./pages/Admin/AdminPanel";
import { ResetPassword } from "./components/ResetPassword";
import { BussinessForm } from "./components/BussinessForm";
import Review from "./pages/Admin/Review";
import Otpverify from "./components/Otpverify";
import SearchResults from "./components/SearchResults";
import { MdOutlineHelp } from "react-icons/md";
import { BiSolidSquareRounded } from "react-icons/bi";
import { FaKeyboard } from "react-icons/fa";
import shorticon from "../public/img/short.svg";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || !user) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  const location = useLocation();
  const [userRole, setUserRole] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState("light");
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.altKey && e.key === "o") {
        navigate("/user/itemsForm");
      }
      if (e.altKey && e.key === "s") {
        navigate("/user/customers/customer-form");
      }
      if (e.altKey && e.key === "j") {
        navigate("/user/expenses/expense-form");
      }
      if (e.altKey && e.key === "n") {
        navigate("/user/invoiceForm");
      }
      if (e.altKey && e.key === "p") {
        navigate("/user/credits/credit-form");
      }
      if (e.altKey && e.key === "g") {
        navigate("/user/purchaseForm");
      }
    };

    // Add event listener for keypress
    document.addEventListener("keydown", handleKeyPress);

    // Clean up event listener on unmount
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [navigate]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.role) {
      setUserRole(user.role);
    }
  }, [location.pathname]);

  const noLayoutRoutes = [
    "/",
    "/signup",
    "/forgetpassword",
    "/otpverify",
    "/resetpsw",
    "/bussinessinfo",
    "/review",
  ];

  const isNoLayout = noLayoutRoutes.includes(location.pathname);

  return (
    <div className={`flex h-screen ${theme === "dark" ? "dark" : ""}`}>
      {!isNoLayout && (
        <>
          <Sidebar
            userRole={userRole}
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={handleToggleSidebar}
          />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header
              onToggleSidebar={handleToggleSidebar}
              onSearch={setSearchQuery}
              theme={theme}
              toggleTheme={toggleTheme}
            />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-[#0F0F12] pt-16 lg:pl-64 min-h-screen relative">
              <div className="fixed right-6 bottom-10 z-30">
                {/* Help Icon */}
                <MdOutlineHelp
                  className="text-4xl w-12 h-12 cursor-pointer me-2 fill-bgprimary"
                  onClick={toggleDropdown}
                />

                {/* Dropdown Menu */}
                {isOpen && (
                  <div className="absolute right-2 bottom-12  mt-2 w-72 bg-white shadow-lg rounded-md z-10 p-3">
                    <h1 className="border-b px-3 py-2 font-semibold text-xl">
                      Shortcuts
                    </h1>
                    <ul className="py-2">
                      <li className="px-4 py-2 hover:bg-[#70a69a] text-lg cursor-pointer flex items-center gap-2">
                        <BiSolidSquareRounded size={8} />
                        Add Item :{" "}
                       Alt
                        + o
                      </li>
                      <li className="px-4 py-2 hover:bg-[#70a69a] text-lg cursor-pointer flex items-center gap-2">
                        <BiSolidSquareRounded size={8} />
                        Add Customer :{" "}
                        Alt
                        + s
                      </li>
                      <li className="px-4 py-2 hover:bg-[#70a69a] text-lg cursor-pointer flex items-center gap-2">
                        <BiSolidSquareRounded size={8} />
                        Create Expense :{" "}
                        Alt
                        + j
                      </li>
                      <li className="px-4 py-2 hover:bg-[#70a69a] text-lg cursor-pointer flex items-center gap-2">
                        <BiSolidSquareRounded size={8} />
                        Create Invoice :{" "}
                        Alt
                        + n
                      </li>
                      <li className="px-4 py-2 hover:bg-[#70a69a] text-lg cursor-pointer flex items-center gap-2">
                        <BiSolidSquareRounded size={8} />
                        Create Credit :{" "}
                        Alt
                        + p
                      </li>
                      <li className="px-4 py-2 hover:bg-[#70a69a] text-lg cursor-pointer flex items-center gap-2">
                        <BiSolidSquareRounded size={8} />
                        Create Purchase :{" "}
                        Alt
                        + g
                      </li>
                    </ul>
                  </div>
                )}
              </div>
              {searchQuery ? (
                <SearchResults query={searchQuery} />
              ) : (
                <Routes>
                  <Route
                    path="/admin/*"
                    element={
                      <ProtectedRoute allowedRoles={["admin"]}>
                        <AdminPanel />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/user/*"
                    element={
                      <ProtectedRoute allowedRoles={["user"]}>
                        <UserPanel />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/"
                    element={
                      localStorage.getItem("token") ? (
                        <Navigate to={`/${userRole}`} />
                      ) : (
                        <Login />
                      )
                    }
                  />
                  <Route
                    path="/signup"
                    element={
                      localStorage.getItem("token") ? (
                        <Navigate to={`/${userRole}`} />
                      ) : (
                        <SignUp />
                      )
                    }
                  />
                  <Route
                    path="/forgetpassword"
                    element={
                      localStorage.getItem("token") ? (
                        <Navigate to={`/${userRole}`} />
                      ) : (
                        <ForgetPassword />
                      )
                    }
                  />
                  <Route
                    path="/otpverify"
                    element={
                      localStorage.getItem("token") ? (
                        <Navigate to={`/${userRole}`} />
                      ) : (
                        <Otpverify />
                      )
                    }
                  />
                  <Route
                    path="/resetpsw"
                    element={
                      localStorage.getItem("token") ? (
                        <Navigate to={`/${userRole}`} />
                      ) : (
                        <ResetPassword />
                      )
                    }
                  />
                  <Route
                    path="/bussinessinfo"
                    element={
                      localStorage.getItem("token") ? (
                        <Navigate to={`/${userRole}`} />
                      ) : (
                        <BussinessForm />
                      )
                    }
                  />
                  <Route path="/review" element={<Review />} />
                </Routes>
              )}
            </main>
          </div>
        </>
      )}

      {isNoLayout && (
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <Routes>
            <Route
              path="/"
              element={
                localStorage.getItem("token") ? (
                  <Navigate to={`/${userRole}`} />
                ) : (
                  <Login />
                )
              }
            />
            <Route
              path="/signup"
              element={
                localStorage.getItem("token") ? (
                  <Navigate to={`/${userRole}`} />
                ) : (
                  <SignUp />
                )
              }
            />
            <Route
              path="/forgetpassword"
              element={
                localStorage.getItem("token") ? (
                  <Navigate to={`/${userRole}`} />
                ) : (
                  <ForgetPassword />
                )
              }
            />
            <Route
              path="/otpverify"
              element={
                localStorage.getItem("token") ? (
                  <Navigate to={`/${userRole}`} />
                ) : (
                  <Otpverify />
                )
              }
            />
            <Route
              path="/resetpsw"
              element={
                localStorage.getItem("token") ? (
                  <Navigate to={`/${userRole}`} />
                ) : (
                  <ResetPassword />
                )
              }
            />
            <Route
              path="/bussinessinfo"
              element={
                localStorage.getItem("token") ? (
                  <Navigate to={`/${userRole}`} />
                ) : (
                  <BussinessForm />
                )
              }
            />
            <Route path="/review" element={<Review />} />
          </Routes>
        </main>
      )}
    </div>
  );
};
const WrappedApp = () => (
  <Router>
    <App />
  </Router>
);
export default WrappedApp;
