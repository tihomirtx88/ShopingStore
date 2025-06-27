import { redirect } from "next/navigation";
import { getAuthUser } from "./auth";
import { createSupabaseServerClient } from "./supabase-server";

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

const fetchOrCreateCart = async ({
  userId,
  errorOrFailer = false,
}: {
  userId: string;
  errorOrFailer?: boolean;
}) => {
  const supabase = await createSupabaseServerClient();

  // 1. Try to fetch the cart
  const { data: carts, error: fetchError } = await supabase
    .from("cart")
    .select("*, cartItems(*)")
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
  const { data: newCart, error: createError } = await supabase
    .from("cart")
    .insert({ clerkid: userId })
    .select("*, cartItems(*)")
    .maybeSingle();

  if (createError) {
    throw new Error(`Failed to create cart: ${createError.message}`);
  }

  return newCart;
};

export const addToCartAction = async (
  prevState: unknown,
  formData: FormData
) => {
  const user = await getAuthUser();
  const supabase = await createSupabaseServerClient();
  try {
    const productId = formData.get("productId") as string;
    const amount = Number(formData.get("amount"));
    await fetchProduct(productId);
    const cart = await fetchOrCreateCar({ userId: user.id });
  } catch (error) {
    console.error("Unexpected error in addCartAction:", error);
    throw new Error("Server error while adding cart items");
  }
  redirect("/cart");
};
