import Link from "next/link";
import { Button } from "../ui/button";
import { FaCartArrowDown } from "react-icons/fa";
import { fetchCartItems } from "../../../utils/cart";

export default async function CartButton() {
  const numItemsInCart = await fetchCartItems();
  // Ако искаш, можеш да ограничиш показваното число, напр. 99+
  const displayCount = numItemsInCart > 99 ? "99+" : numItemsInCart;

  return (
    <Button
      asChild
      variant="outline"
      size="icon"
      className="flex justify-center items-center relative"
    >
      <Link href="/cart" className="relative">
        <FaCartArrowDown className="text-xl" />
        <span
                 className={`
            absolute -top-4 -right-2
            bg-primary 
            rounded-full 
            min-w-[1rem] h-6 
            px-1.5
            flex items-center justify-center 
            text-xs font-semibold 
            border-2
            select-none 
            whitespace-nowrap 
            overflow-hidden 
            text-ellipsis
            text-[hsl(var(--foreground))] 
            border-[hsl(var(--border))]
          `}
        >
          {displayCount}
        </span>
      </Link>
    </Button>
  );
}
