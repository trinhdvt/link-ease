import type React from "react";

import SignInWithGoogle from "@/features/auth/components/sign-in-with-google";
import UserProfile from "@/features/user/components/user-profile";
import type { User } from "@/features/user/types";
import Navigation from "./navigation";
import { ThemeToggle } from "./theme-toggle";

interface HeaderProps {
  user?: User;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-xs dark:bg-gray-800 dark:border-gray-700">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Navigation />
        <div className="flex items-center gap-x-4">
          {user ? <UserProfile user={user} /> : <SignInWithGoogle />}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
