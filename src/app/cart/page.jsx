import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { fetchOrCreateCart, updateCart } from "../../../utils/cart";
import SectionTitle from "@/components/global/SectionTitle";
import CartItemsList from "@/components/card/CartItemsList";
import CartTotals from "@/components/card/CartTotals";

export const dynamic = "force-dynamic";

async function Cart() {
  const { userId } = await auth();

  if (!userId) redirect("/");
  const previousCart = await fetchOrCreateCart({ userId });
  
  const { cartItems, updatedCart} = await updateCart(previousCart);
  if (cartItems.length === 0) return <SectionTitle text="Empty Cart" />;

  return (
    <>
      <SectionTitle text="Shopping Cart" />
      <div className="mt-8 grid gap-4 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <CartItemsList 
          // cartItems={cartItems} 
          />
        </div>
        <div className="lg:col-span-4">
          <CartTotals
          //  cart={currentCart} 
           />
        </div>
      </div>
    </>
  );
}
export default Cart;
