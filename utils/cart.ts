"use server";

import { redirect } from "next/navigation";
import { getAuthUser } from "./auth";
import { createSupabaseServerClient } from "./supabase-server";

import { randomUUID } from "crypto";

export type Cart = {
  id: string;
  clerkid: string;
  numItemsInCart: number;
  cartTotal: number;
  shipping: number;
  tax: number;
  taxRate: number;
  orderTotal: number;
};

export const fetchCartItems = async () => {
  try {
    let user = null;

    try {
      user = await getAuthUser();
    } catch (authError) {
      console.log(authError);

      return 0;
    }

    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("Cart")
      .select("numItemsInCart")
      .eq("clerkid", user.id)
      .maybeSingle();

    if (error) {
      console.error(
        "Supabase error while fetching cart:",
        JSON.stringify(error, null, 2)
      );
      throw new Error("Failed to fetch cart items for user");
    }

    return data?.numItemsInCart || 0;
  } catch (error) {
    console.error("Unexpected error in fetchCartItems:", error);
    throw new Error("Server error while fetching cart items");
  }
};

const fetchProduct = async (productId: string) => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .single();

  if (!data) {
    throw new Error("Product not exist");
  }

  return data;
};

export const fetchOrCreateCart = async ({
  userId,
  errorOrFailer = false,
}: {
  userId: string;
  errorOrFailer?: boolean;
}) => {
  const supabase = await createSupabaseServerClient();

  // 1. Try to fetch the cart
  const { data: carts, error: fetchError } = await supabase
    .from("Cart")
    .select("*")
    .eq("clerkid", userId)
    .limit(1)
    .maybeSingle();

  if (fetchError) {
    throw new Error(`Failed to fetch cart: ${fetchError.message}`);
  }

  // 2. If cart is found, return it
  if (carts) {
    return carts;
  }

  // 3. If errorOrFailer is true, throw
  if (!carts && errorOrFailer) {
    throw new Error("Cart not found");
  }
  // 4. Create new cart
  const cartId = crypto.randomUUID();
  const now = new Date().toISOString();
  const { data: newCart, error: createError } = await supabase
    .from("Cart")
    .insert({
    id:cartId,    
    clerkid: userId,
    createdAt: now,
    updatedAt: now, })
    .select("*")
    .maybeSingle();

  if (createError) {
    throw new Error(`Failed to create cart: ${createError.message}`);
  }

  return newCart;
};

const updatePrCreateCartItem = async ({
  productId,
  cartId,
  amount,
}: {
  productId: string;
  cartId: string;
  amount: number;
}) => {
  const supabase = await createSupabaseServerClient();

  // Check if the cart item already exists
  const { data: existingItem, error: fetchError } = await supabase
    .from("CartItem")
    .select("*")
    .eq("productId", productId)
    .eq("cartId", cartId)
    .maybeSingle();

  if (fetchError) {
    throw new Error(`Failed to fetch cart item: ${fetchError.message}`);
  }

  if (existingItem) {
    //If it exists, update the amount
    const { error: updateError } = await supabase
      .from("CartItem")
      .update({ amount: existingItem.amount + amount })
      .eq("id", existingItem.id);

    if (updateError) {
      throw new Error(`Failed to update cart item: ${updateError.message}`);
    }
  } else {
    //If not, insert a new cart item
     const now = new Date().toISOString();
    const { error: insertError } = await supabase
      .from("CartItem")
      .insert({  id: randomUUID(), amount, cartId, productId, createdAt: now,
    updatedAt: now, });

    if (insertError) {
      throw new Error(`Failed to insert new cart item: ${insertError.message}`);
    }
  }
};

export const updateCart = async (cart: Cart) => {
  const supabase = await createSupabaseServerClient();

  // 1. Get cart items with product info
  const { data: cartItems, error: itemsError } = await supabase
    .from("CartItem")
    .select("*, product:products(*)")
    .eq("cartId", cart.id);

  if (itemsError) {
    throw new Error(`Failed to fetch cart items: ${itemsError.message}`);
  }

  if (!cartItems || cartItems.length === 0) {
    return cart;
  }
  // 2. Compute totals
  let numItemsInCart = 0;
  let cartTotal = 0;

  for (const item of cartItems) {
    numItemsInCart += item.amount;
    cartTotal += item.amount * (item.product?.price || 0);
  }

  const tax = cart.taxRate * cartTotal;
  const shipping = cartTotal > 0 ? cart.shipping : 0;
  const orderTotal = cartTotal + tax + shipping;

  // 3. Update cart
  const { data: updatedCart, error: updateError } = await supabase
    .from("Cart")
    .update({
      numItemsInCart,
      cartTotal,
      tax,
      orderTotal,
    })
    .eq("id", cart.id)
    .select("*")
    .maybeSingle();

  if (updateError) {
    throw new Error(`Failed to update cart totals: ${updateError.message}`);
  }

  return {cartItems, updatedCart};
};

export const addToCartAction = async (
  prevState: unknown,
  formData: FormData
) => {
  const user = await getAuthUser();
  try {
    const productId = formData.get("productId") as string;
    const amount = Number(formData.get("amount"));

    await fetchProduct(productId);
    const cart = await fetchOrCreateCart({ userId: user.id });

    await updatePrCreateCartItem({ productId, cartId: cart.id, amount });

    await updateCart(cart);
  } catch (error) {
    console.error("Unexpected error in addCartAction:", {
      error,
      productId: formData.get("productId"),
      amount: formData.get("amount"),
      userId: user?.id,
    });
    throw new Error("Server error while adding cart items");
  }
  redirect("/cart");
};

export const updateCartItemAction = async ({
  amount,
  cartItemId,
}: {
  amount: number;
  cartItemId: string;
}) => {
  return{message: 'success'}
};

export const removeCartItemAction = async (prevState: unknown,
  formData: FormData) => {

};
