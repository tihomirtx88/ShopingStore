'use client'

import { SignOutButton } from "@clerk/nextjs";
import Link from "next/link";
import { toast } from "sonner";

export default function SainOutLink() {
  const handleLogout = () => {
    toast.success('Logout Successful');
  };
  return (
    <SignOutButton>
      <Link href='/' className="w-full text-left text-base" onClick={handleLogout}>Sign Out</Link>
    </SignOutButton>
  )
}
