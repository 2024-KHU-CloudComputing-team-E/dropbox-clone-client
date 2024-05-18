import React from "react";
import Header from "../components/Header";
import Leftbar from "../components/Leftbar";
import { Outlet } from "react-router-dom";

export default function MainPage() {
  return (
    <div>
      <Header />
      <Leftbar />
      <Outlet />
    </div>
  );
}
