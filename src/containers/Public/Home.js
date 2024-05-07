import React from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import { Navigation, Search } from "./index";
import { Contact, Intro } from "../../components";

function Home() {
  return (
    <div className="w-full flex flex-col items-center m-auto h-full border border-red-500">
      <Header />
      <Navigation />
      <Search />
      <div className="w-3/4 flex flex-col items-center justify-center">
        <Outlet />
      </div>
      <Intro />
      <Contact />
      <div className="h-48">

      </div>
    </div>
  );
}

export default Home;
