import React, { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import {
  FaUsers,
  FaBox,
  FaFileInvoice,
  FaRegMoneyBillAlt,
  FaCreditCard,
  FaChartBar,
  FaComments,
} from "react-icons/fa";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { IoChevronDownSharp } from "react-icons/io5";
import { MdAdd, MdKeyboardArrowUp } from "react-icons/md";
import { MdLogin } from "react-icons/md";

const Sidebar = ({ userRole, isSidebarOpen, onToggleSidebar }) => {
  const [isInvoiceDropdownOpen, setIsInvoiceDropdownOpen] = useState(false);
  const [isItemsDropdownOpen, setIsItemsDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleInvoiceDropdown = () => {
    setIsInvoiceDropdownOpen(!isInvoiceDropdownOpen);
  };
  const toggleItemsDropdown = () => {
    setIsItemsDropdownOpen(!isItemsDropdownOpen);
  };
  const handleRedirect = () => {
    navigate("/user/invoicetemp"); // Redirects to the 'purchase invoice' page
  };

  return (
    <aside
      className={` bg-white dark:bg-[#17191A] w-64 min-h-screen fixed flex flex-col transition-all duration-300 ease-in-out ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 z-30`}
    >
      <div className="flex flex-col h-full">
        {/* Sidebar Toggle for Mobile */}
        <div className="text-right pe-2 lg:hidden">
          <button onClick={onToggleSidebar} className="p-2">
            <X size={24} />
          </button>
        </div>

        {/* Logo */}
        <div className="logo p-3 border-b mx-auto">
          <img src="/img/logo.png" className="w-[150px]" alt="Company Logo" />
        </div>

        {/* Navigation */}
        <nav>
          <ul className="space-y-2 py-2 ps-5 mt-3">
            {/* Role-Based Links */}
            {userRole === "admin" ? (
              <>
                {/* Admin Links */}
                <li>
                  <NavLink
                    to="/admin"
                    end
                    className={({ isActive }) =>
                      `flex items-center p-3 text-base font-semibold transition duration-300 ${
                        isActive
                          ? "bg-gradient-to-r from-[#428a794d] text-[#438A7A] rounded-l-full"
                          : "text-gray-500 dark:text-white"
                      }`
                    }
                  >
                    <TbLayoutDashboardFilled className="me-2" />
                    <span>Dashboard</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/admin/complain"
                    className={({ isActive }) =>
                      `flex items-center p-3 text-base font-semibold transition duration-300 ${
                        isActive
                          ? "bg-gradient-to-r from-[#428a794d] text-[#438A7A] rounded-l-full"
                          : "text-gray-500 dark:text-white"
                      }`
                    }
                  >
                    <FaChartBar className="me-2" />
                    <span>Complain</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/admin/reviewreports"
                    className={({ isActive }) =>
                      `flex items-center p-3 text-base font-semibold transition duration-300 ${
                        isActive
                          ? "bg-gradient-to-r from-[#428a794d] text-[#438A7A] rounded-l-full"
                          : "text-gray-500"
                      }`
                    }
                  >
                    <FaChartBar className="me-2" />
                    <span>Review Reports</span>
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                {/* User Links */}
                <div className="mb-[38%]">
                  <li>
                    <NavLink
                      to="/user"
                      end
                      className={({ isActive }) =>
                        `flex items-center p-3 text-base font-semibold transition duration-300 ${
                          isActive
                            ? "bg-gradient-to-r from-[#428a794d] text-[#438A7A] rounded-l-full"
                            : "text-gray-500 dark:text-white"
                        }`
                      }
                    >
                      <TbLayoutDashboardFilled className="me-2" />
                      <span>Dashboard</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/user/customers"
                      className={({ isActive }) =>
                        `flex items-center p-3 text-base font-semibold transition duration-300 ${
                          isActive
                            ? "bg-gradient-to-r from-[#428a794d] text-[#438A7A] rounded-l-full"
                            : "text-gray-500 dark:text-white"
                        }`
                      }
                    >
                      <FaUsers className="me-2" />
                      <span>Customers</span>
                    </NavLink>
                  </li>
                  <li>
                    <button
                      onClick={toggleItemsDropdown}
                      className="flex items-center w-full p-3 text-base font-semibold text-gray-500 dark:text-white transition duration-300 focus-visible:bg-gradient-to-r focus-visible:from-[#428a794d] focus-visible:text-[#438A7A] rounded-l-full"
                    >
                      <FaBox className="me-2" />
                      <span>Items</span>
                      <span className="ms-auto me-3">
                        {isItemsDropdownOpen ? (
                          <MdKeyboardArrowUp />
                        ) : (
                          <IoChevronDownSharp />
                        )}
                      </span>
                    </button>
                    {isItemsDropdownOpen && (
                      <ul className="pl-8 space-y-2 mt-2">
                        <li>
                          <NavLink
                            to="/user/items"
                            className={({ isActive }) =>
                              `block p-2 transition duration-300 text-base font-medium ${
                                isActive
                                  ? "text-[#438A7A]"
                                  : "text-gray-500 dark:text-white"
                              }`
                            }
                          >
                            Item
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            to="/user/itemreport"
                            className={({ isActive }) =>
                              `block p-2 transition duration-300 text-base font-medium ${
                                isActive
                                  ? "text-[#438A7A]"
                                  : "text-gray-500 dark:text-white"
                              }`
                            }
                          >
                            Item Report By Stock
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            to="/user/viewitemreportbyamount"
                            className={({ isActive }) =>
                              `block p-2 transition duration-300 text-base font-medium ${
                                isActive
                                  ? "text-[#438A7A]"
                                  : "text-gray-500 dark:text-white"
                              }`
                            }
                          >
                            Item Report By Sale
                          </NavLink>
                        </li>
                      </ul>
                    )}
                  </li>
                  <li>
                    <button
                      onClick={toggleInvoiceDropdown}
                      className="flex items-center w-full p-3 text-base font-semibold text-gray-500 dark:text-white transition duration-300"
                    >
                      <FaFileInvoice className="me-2" />
                      <span>Invoices</span>
                      <span className="ms-auto me-3">
                        {isInvoiceDropdownOpen ? (
                          <MdKeyboardArrowUp />
                        ) : (
                          <IoChevronDownSharp />
                        )}
                      </span>
                    </button>
                    {isInvoiceDropdownOpen && (
                      <ul className="pl-8 space-y-2 mt-2">
                        <li>
                          <NavLink
                            to="/user/purchaseinvoice"
                            className={({ isActive }) =>
                              `block p-2 transition duration-300 text-base font-medium ${
                                isActive
                                  ? "text-[#438A7A]"
                                  : "text-gray-500 dark:text-white"
                              }`
                            }
                          >
                            Purchase Invoice
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            to="/user/invoice"
                            className={({ isActive }) =>
                              `block p-2 transition duration-300 text-base font-medium ${
                                isActive
                                  ? "text-[#438A7A]"
                                  : "text-gray-500 dark:text-white"
                              }`
                            }
                          >
                            Sales Invoice
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            to="/user/invoicereport"
                            className={({ isActive }) =>
                              `block p-2 transition duration-300 text-base font-medium ${
                                isActive
                                  ? "text-[#438A7A]"
                                  : "text-gray-500 dark:text-white"
                              }`
                            }
                          >
                            Invoice Report
                          </NavLink>
                        </li>
                      </ul>
                    )}
                  </li>
                  <li>
                    <NavLink
                      to="/user/expenses"
                      className={({ isActive }) =>
                        `flex items-center p-3 text-base font-semibold transition duration-300 ${
                          isActive
                            ? "bg-gradient-to-r from-[#428a794d] text-[#438A7A] rounded-l-full"
                            : "text-gray-500 dark:text-white"
                        }`
                      }
                    >
                      <FaRegMoneyBillAlt className="me-2" />
                      <span>Expenses</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/user/credits"
                      className={({ isActive }) =>
                        `flex items-center p-3 text-base font-semibold transition duration-300 ${
                          isActive
                            ? "bg-gradient-to-r from-[#428a794d] text-[#438A7A] rounded-l-full"
                            : "text-gray-500 dark:text-white"
                        }`
                      }
                    >
                      <FaCreditCard className="me-2" />
                      <span>Credit</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/user/complain"
                      className={({ isActive }) =>
                        `flex items-center p-3 text-base font-semibold transition duration-300 ${
                          isActive
                            ? "bg-gradient-to-r from-[#428a794d] text-[#438A7A] rounded-l-full"
                            : "text-gray-500 dark:text-white"
                        }`
                      }
                    >
                      <FaComments className="me-2" />
                      <span>Complain</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/user/reportsandanalytics"
                      className={({ isActive }) =>
                        `flex items-center p-3 text-base font-semibold transition duration-300 ${
                          isActive
                            ? "bg-gradient-to-r from-[#428a794d] text-[#438A7A] rounded-l-full"
                            : "text-gray-500 dark:text-white"
                        }`
                      }
                    >
                      <FaChartBar className="me-2" />
                      <span>Reports & Analytics</span>
                    </NavLink>
                  </li>
                </div>
                <div className="w-[80%] m-auto bg-[#F6F8FB] rounded-lg p-4 text-center relative pt-[70px] pb-[10px] px-[10px]">
                  <div className="absolute top-[-70px] left-[27px]">
                    <img src="/img/invoice.png" width="130px" />
                  </div>
                  <div className="text">
                    <p className="text-md font-semibold">
                      Upgrade To Pro For More Features
                    </p>
                    <div className="btn flex justify-center mt-2">
                      <Link to="/user/invoicetemp">
                        <button className="btn flex items-center bg-[#438A7A] text-white rounded-lg px-6 py-3 mb-3">
                          <h3> create invoice</h3>
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </>
            )}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
