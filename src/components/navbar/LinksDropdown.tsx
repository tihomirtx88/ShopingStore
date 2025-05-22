import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { links } from "../../../utils/links";
import Link from "next/link";
import { LuAlignLeft } from "react-icons/lu";
import UserIcon from "./UserIcon";


import SainOutLink from "./SainOutLink";
import { SignInButton, SignedIn, SignedOut, SignUpButton } from '@clerk/nextjs';

export default function LinksDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex gap-4 max-w-[100px]">
          <LuAlignLeft className="w-6 h-6" />
          <UserIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="start" sideOffset={10}>
        <SignedOut>
          <DropdownMenuItem>
            <SignInButton mode="modal">
              <button className="text-left w-full text-base">Login</button>
            </SignInButton>
          </DropdownMenuItem>
          <SignUpButton mode="modal">
              <button className="text-left w-full p-2 text-base">Register</button>
            </SignUpButton>

        </SignedOut>
        <SignedIn>
          {links.map((link) => {
          return (
            <DropdownMenuItem key={link.href}>
              <Link href={link.href} className="capitalize w-full">
                {link.label}
              </Link>
            </DropdownMenuItem>
          );
        })}
        </SignedIn>

        <DropdownMenuItem>
          <SainOutLink />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
