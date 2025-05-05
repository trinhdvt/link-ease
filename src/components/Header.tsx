import type React from "react";

import SignInWithGoogle from "@/features/auth/components/sign-in-with-google";
import UserProfile from "@/features/user/components/user-profile";
import type { User } from "@/features/user/types";
import Navigation from "./Navigation";

interface HeaderProps {
  user?: User;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Navigation />
        {user ? <UserProfile user={user} /> : <SignInWithGoogle />}
      </div>
    </header>
  );
};

export default Header;
