"use server";

import { auth } from "@clerk/nextjs/server";
import { supabase } from "./supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const fetchFeaturedProducts = async () => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("featured", true);

  if (error) {
    throw new Error("Failed to fetch featured products");
  }

  return data;
};

export const fetchAllProducts = async ({ search = "" }: { search: string }) => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .or(`name.ilike.%${search}%,company.ilike.%${search}%`)
    .order("createdAt", { ascending: false });

  if (error) {
    console.error(error);
    throw new Error("Failed to fetch all products");
  }

  return data;
};

export const fetchsingleProduct = async (productId: string) => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .single();

  if (error || !data) {
    console.error(error || "No product found");
  }

  return data;
};

export const createProduct = async (
  prevState: any,
  formdata: FormData
): Promise<{ message: string }> => {
  const session = await auth();
  if (!session) throw new Error("You must to logged in!");

  const imageFile = formdata.get("image") as File;
  let imageUrl = "";

  if (imageFile && imageFile.size > 0) {
    const fileName = `${Date.now()}-${imageFile.name}`;

    const { error: uploadError } = await supabase.storage
      .from("products-images")
      .upload(`products/${fileName}`, imageFile);

    if (uploadError) {
      console.error("Image upload error:", uploadError.message);
      throw new Error("Image upload failed.");
    }

    const { data: publicUrlData } = supabase.storage
      .from("products-images")
      .getPublicUrl(`products/${fileName}`);

    imageUrl = publicUrlData?.publicUrl ?? "";
  }

  // Handle image upload if provided
  const newProduct = {
    name: formdata.get("name") as string,
    company: formdata.get("company") as string,
    price: Number(formdata.get("price") || 0),
    image: imageUrl,
    description: formdata.get("description") as string,
    featured: formdata.get("featured") === "on",
    user_id: session.user.id,
  };

  const { error: insertError } = await supabase
    .from("products")
    .insert(newProduct);

  if (insertError) {
    console.error("Insert error:", insertError.message);
    throw new Error("Failed to create product.");
  }

  revalidatePath("/products");
  redirect("/products");

  return { message: "Product created successfully!" };
};
