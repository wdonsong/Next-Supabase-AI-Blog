"use client";

import { useMemo } from "react";
import Link from "next/link";
import { LogOut, LayoutDashboard, UserIcon } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import useUserSession from "@/lib/hooks/use-user-session";
import useSignOut from "@/lib/hooks/use-sign-out";

function ProfileDropdown() {
  const signOut = useSignOut();
  const displayName = useDisplayName();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarFallback>{displayName}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href={"/dashboard"}>
            <DropdownMenuItem>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuItem onClick={signOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ProfileDropdown;

function useDisplayName() {
  const session = useUserSession();

  return useMemo(() => {
    if (!session?.user) {
      return null;
    }

    const { email, user_metadata } = session.user;

    if (user_metadata?.full_name) {
      return user_metadata.full_name.substring(0, 2).toUpperCase();
    }

    if (email) {
      return email.substring(0, 2).toUpperCase();
    }

    return <UserIcon className="h-4" />;
  }, [session]);
}
