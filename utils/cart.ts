import { getAuthUser } from "./auth";
import { createSupabaseServerClient } from "./supabase-server";

export const fetchCartItems = async () => {
    try {
    const user = await getAuthUser();
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("Cart")
      .select("numItemsInCart")
      .eq("clerkid", user.id)
      .maybeSingle(); 

    if (error) {
      console.error("Supabase error while fetching cart:", JSON.stringify(error, null, 2));
      throw new Error("Failed to fetch cart items for user");
    }

    return data?.numItemsInCart || 0;
  } catch (error) {
    console.error("Unexpected error in fetchCartItems:", error);
    throw new Error("Server error while fetching cart items");
  }
};