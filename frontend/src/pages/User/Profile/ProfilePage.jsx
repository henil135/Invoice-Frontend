import React from "react";

import { Outlet, Route, Routes } from "react-router-dom";
import ProfileSidebar from "../../../components/ProfileSidebar";

export const ProfilePage = () => {
  return (
    <>
      <div className="h-[200px] sm:h-[250px] md:h-[296px] lg:h-[350px] bg-[#438a7a]"></div>
      <div className="w-[80%] mt-[-10rem] sm:mt-[-15rem] lg:mt-[-20rem] m-auto">
        <div className="pb-[15px]">
          <h2
            className="font-medium text-[44px] text-white 
            m-[1rem_1rem_2rem_2rem] 
            sm:m-[2rem_1rem_4rem_2rem]"
          >
            Profile
          </h2>
        </div>
        <div className="bg-white rounded-lg p-5 shadow-lg sm:flex">
          <ProfileSidebar />
          <div className="w-[100%] sm:w-[75%] lg:w-[75%] ps-5">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};
