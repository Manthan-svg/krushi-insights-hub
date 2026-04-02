import React from "react";
import TopBar from "./TopBar";
import BottomNav from "./BottomNav";
import { OfflineBanner } from "../OfflineBanner";

interface MobileLayoutProps {
  children: React.ReactNode;
  title?: string;
  showNav?: boolean;
  showTopBar?: boolean;
}

const MobileLayout = ({ children, title, showNav = true, showTopBar = true }: MobileLayoutProps) => {
  return (
    <div className="h-[100dvh] max-w-lg mx-auto bg-background flex flex-col overflow-hidden">
      {showTopBar && <TopBar title={title} />}
      <OfflineBanner />
      <main className={`flex-1 overflow-y-auto scrollbar-hidden ${showNav ? "pb-20" : ""}`}>{children}</main>
      {showNav && <BottomNav />}
    </div>
  );
};

export default MobileLayout;
