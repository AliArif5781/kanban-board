import { Outlet } from "react-router";
import Navbar from "../common/Navbar";

const Layout = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
};

export default Layout;
