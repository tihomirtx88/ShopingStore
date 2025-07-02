"use server";

import { redirect } from "next/navigation";
import { getAdminUser, getAuthUser } from "./auth";
import { createSupabaseServerClient } from "./supabase-server";
import { fetchOrCreateCart } from "./cart";

export const createOrderAction = async (
  prevState: unknown,
  formData: FormData
): Promise<{ message: string }> => {
  const user = await getAuthUser();

  let orderId: string | null = null;
  let cartId: string | null = null;

  try {
    const supabase = await createSupabaseServerClient();

    const cart = await fetchOrCreateCart({
      userId: user.id,
      errorOrFailer: true,
    });

    cartId = cart.id;

    // 1. Delete previous unpaid orders for this user
    const { error: deleteError } = await supabase
      .from("Order")
      .delete()
      .eq("clerkId", user.id)
      .eq("isPaid", false);

    if (deleteError) {
      throw new Error("Failed to delete previous unpaid orders.");
    }

    // 2. Create new order
    const orderIdd = crypto.randomUUID();
    const { data: orderDataArray, error: insertError } = await supabase
      .from("Order")
      .insert([
        {
          id: orderIdd,
          clerkId: user.id,
          products: cart.numItemsInCart,
          orderTotal: cart.orderTotal,
          tax: cart.tax,
          shipping: cart.shipping,
          email: user.emailAddresses[0].emailAddress,
          isPaid: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
      ])
      .select()
      
      const orderData = orderDataArray?.[0];

    if (insertError || !orderData) {
      console.error("Insert error:", insertError);
      console.error("Returned data:", orderData);
      throw new Error(`Failed to create order: ${insertError?.message || "Unknown error"}`);
    }

    orderId = orderData.id;
  } catch (error) {
    console.error("Order creation failed:", error);
    return { message: "Something went wrong while creating order." };
  }

  redirect(`/checkout?orderId=${orderId}&cartId=${cartId}`);
};

export const fetchUserOrders = async () => {
  const user = await getAuthUser();
  const supabase = await createSupabaseServerClient();

  const { data: orders, error } = await supabase
    .from("Order")
    .select("*")
    .eq("clerkId", user.id)
    .eq("isPaid", true)
    .order("createdAt", { ascending: false });

  if (error) {
    console.error("Failed to fetch orders:", error);
    return [];
  }

  return orders;
};

export const fetchAdminOrders = async () => {
  await getAdminUser();

  const supabase = await createSupabaseServerClient();

  const { data: orders, error } = await supabase
    .from("Order")
    .select("*")
    .eq("isPaid", true)
    .order("createdAt", { ascending: false });

  if (error) {
    console.error("Failed to fetch admin orders:", error);
    return [];
  }

  return orders;
};
