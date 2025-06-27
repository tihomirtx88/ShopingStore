import Link from "next/link";
import { Button } from "../ui/button";
import { FaCartArrowDown } from "react-icons/fa";
import { fetchCartItems } from "../../../utils/cart";

export default async function CartButton() {
  const numItemsInCart = await fetchCartItems();
  return (
    <Button
      asChild
      variant="outline"
      size="icon"
      className="flex justify-center items-center realtive"
    >
      <Link href="/cart">
        <FaCartArrowDown />
        <span className="absolute -top-3 -right-3 bg-primary text-white rounded-full h-6 w-6 flex items-center justify-center text-xs">{numItemsInCart}</span>
      </Link>
    </Button>
  );
}
