import Link from "next/link";
import { Button } from "../ui/button";
import { FaHome } from "react-icons/fa";

export default function Logo() {
  return (
    <Button size='icon' asChild>
      <Link href="/">
        <FaHome className="w-6 h-6"/>
      </Link>
    </Button>
  );
}
