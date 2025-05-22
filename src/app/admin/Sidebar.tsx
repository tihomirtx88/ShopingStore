'use client';

import { usePathname } from "next/navigation";
import { adminLinks } from "../../../utils/links";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside>
      {adminLinks.map((link) => {
        const isActivePage = pathname === link.href;
        const variant = isActivePage ? 'secondary' : 'ghost';
        
        return (
          <Button
            key={link.href} // ✅ key moved here
            variant={variant} // ✅ changed `value` to `variant`
            className="w-full mb-2 capitalize font-normal"
            asChild
          >
            <Link href={link.href}>{link.label}</Link>
          </Button>
        );
      })}
    </aside>
  );
}