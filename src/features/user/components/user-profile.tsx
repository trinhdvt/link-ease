"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ChevronDown, LayoutDashboard, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { User } from "@/features/user/types";
import Link from "next/link";

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
                className="text-sm font-medium text-foreground"
                data-testid="user-profile-trigger"
              >
                <span>{user.displayName || user.email}</span>
                <ChevronDown className="ml-1 h-4 w-4 text-foreground group-hover:text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-w-56">
              <DropdownMenuItem asChild>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
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
