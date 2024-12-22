import { Outlet } from "react-router-dom";

import Topbar from "@/components/shared/Topbar";
import Bottombar from "@/components/shared/Bottombar";
import LeftSidebar from "@/components/shared/LeftSidebar"; 

const RootLayout = () => {
  return (
    <div className="w-full md:flex">
      <Topbar />
      <LeftSidebar />

      <section className="flex flex-1 h-full flex-col">
        <Outlet />

        {/* Add the MessagingForm below the Outlet */}
        
      </section>

      <Bottombar />
    </div>
  );
};

export default RootLayout;
