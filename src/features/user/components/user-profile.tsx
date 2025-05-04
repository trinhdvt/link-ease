"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ChevronDown, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { User } from "@/features/user/types";
import { useRouter } from "next/navigation";

type UserProfileProps = {
  user: User;
};

export default function UserProfile({ user }: UserProfileProps) {
  const handleSignOut = async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });
      window.location.href = "/";
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center">
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={user.photoURL}
            alt={user.displayName || "User"}
            width={32}
            height={32}
          />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>

        <div className="ml-2 hidden md:block">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="text-sm font-medium text-gray-700"
                data-testid="user-profile-trigger"
              >
                <span>{user.displayName || user.email}</span>
                <ChevronDown className="ml-1 h-4 w-4 text-gray-500 group-hover:text-gray-700" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-w-56">
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={handleSignOut}
              >
                <LogOut />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
