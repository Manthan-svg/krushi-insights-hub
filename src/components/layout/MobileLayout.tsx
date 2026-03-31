import React from "react";
import TopBar from "./TopBar";
import BottomNav from "./BottomNav";

interface MobileLayoutProps {
  children: React.ReactNode;
  title?: string;
  showNav?: boolean;
  showTopBar?: boolean;
}

const MobileLayout = ({ children, title, showNav = true, showTopBar = true }: MobileLayoutProps) => {
  return (
    <div className="min-h-screen max-w-lg mx-auto bg-background flex flex-col">
      {showTopBar && <TopBar title={title} />}
      <main className={`flex-1 ${showNav ? "pb-20" : ""}`}>{children}</main>
      {showNav && <BottomNav />}
    </div>
  );
};

export default MobileLayout;
