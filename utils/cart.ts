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
      console.error("Supabase error while fetching cart:", JSON.stringify(error, null, 2));
      throw new Error("Failed to fetch cart items for user");
    }

    return data?.numItemsInCart || 0;
  } catch (error) {
    console.error("Unexpected error in fetchCartItems:", error);
    throw new Error("Server error while fetching cart items");
  }
};

export const addToCartAction = async (
  prevState: unknown,
  formData: FormData
): Promise<{ message: string }> => {
  return { message: 'success add to cart' };
};