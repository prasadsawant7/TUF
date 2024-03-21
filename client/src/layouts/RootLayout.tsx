import Navbar from "@/components/custom/navbar";
import { Toaster } from "@/components/ui/toaster";
import { Outlet } from "react-router-dom";

function RootLayout() {
  return (
    <>
      <Navbar />
      <main className="h-screen bg-leetcode-bg text-leetcode-fg">
        <Outlet />
      </main>
      <Toaster />
    </>
  );
}

export default RootLayout;
