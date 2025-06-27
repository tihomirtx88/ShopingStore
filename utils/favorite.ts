"use server";

import { auth } from "@clerk/nextjs/server";
import { getAuthUser } from "./auth";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "./supabase-server";

export const toggleFavoriteAction = async (_: unknown, formData: FormData) => {
  const supabase = await createSupabaseServerClient();
  const { userId } = await auth();
  if (!userId) return { message: "Not authenticated" };

  const productid = formData.get("productId") as string;
  const favoriteId = formData.get("favoriteId") as string;
  const pathName = formData.get("pathName") as string;

  try {
    if (favoriteId) {
      await supabase.from("Favorite").delete().eq("id", favoriteId);
      revalidatePath(pathName);
      return { message: "Removed from favorites" };
    } else {
      const now = new Date().toISOString();
      await supabase.from("Favorite").insert([{ productid, clerkid: userId, created_at: now, updated_at: now }]);
      revalidatePath(pathName);
      return { message: "Added to favorites" };
    }
  } catch (err) {
    console.error("toggleFavoriteAction error:", err);
    return { message: "Server error" };
  }
};

export const fetchFavroiteId = async ({ productId }: { productId: string }) => {
  try {
    const user = await getAuthUser();
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("Favorite")
      .select("id, clerkid, productid, created_at, updated_at")
      .eq("productid", productId)
      .eq("clerkid", user.id);

    if (error) {
      console.error("Supabase error object:", JSON.stringify(error, null, 2));
      throw new Error("Failed to fetch favorite for user and product");
    }

    return data?.[0] ?? null;
  } catch (error) {
    console.error("Unexpected error in fetchFavoriteId:", error);
    throw new Error("Server error while fetching favorite");
  }
};


export const fetchUserFavroite = async () => {
  try {
    const user = await getAuthUser();
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("Favorite")
      .select("id, clerkid, created_at, updated_at, productid(*)")
      .eq("clerkid", user.id);

    if (error) {
      console.error("Supabase error object:", JSON.stringify(error, null, 2));
      throw new Error("Failed to fetch favorite for user and product");
    }

    return data;
  } catch (error) {
    console.error("Unexpected error in fetchFavoriteId:", error);
    throw new Error("Server error while fetching favorite");
  }
};