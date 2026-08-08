import { Search, Bell, Menu } from "lucide-react";
import UserProfile from "./UserProfile";

const Navbar = ({ onMenuClick }) => {
  return (
    <header className="h-16 shrink-0 bg-white/70 dark:bg-[#0B0F19]/70 backdrop-blur-xl border-b border-black/5 dark:border-white/10 flex items-center justify-between gap-4 px-4 sm:px-6">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden shrink-0 p-2 rounded-xl text-[#5C5F80] dark:text-[#9296B8] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full max-w-md group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9296B8] group-focus-within:text-indigo-500 transition-colors" />
          <input
            type="text"
            placeholder="Search files and folders..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#F4F5FA] dark:bg-white/5 rounded-xl text-sm placeholder:text-[#A2A5C4] dark:placeholder:text-[#6C709A] outline-none border border-transparent focus:bg-white dark:focus:bg-white/[0.07] focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <button className="relative p-2.5 rounded-xl text-[#5C5F80] dark:text-[#9296B8] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors">
          <Bell className="w-[18px] h-[18px]" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-gradient-to-br from-rose-400 to-red-500 ring-2 ring-white dark:ring-[#0B0F19]" />
        </button>
        <UserProfile />
      </div>
    </header>
  );
};

export default Navbar;
