"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import {
  imageSchema,
  productSchema,
  reviewSchema,
  validateWithZodSchema,
} from "./schemas";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "./supabase-server";
import { ZodError } from "zod";

export const getAuthUser = async () => {
  const user = await currentUser();
  if (!user) redirect("/");
  return user;
};

export const getAdminUser = async () => {
  const user = await getAuthUser();
  if (user.id !== process.env.ADMIN_USER_ID) redirect("/");
  return user;
};

export const fetchFeaturedProducts = async () => {
  const supabase = await createSupabaseServerClient();
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
  const supabase = await createSupabaseServerClient();
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
  const supabase = await createSupabaseServerClient();
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
  prevState: unknown,
  formData: FormData
): Promise<{ message: string }> => {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { message: "User not authenticated" };
    }

    const formEntries = Object.fromEntries(formData.entries());

    // Extract image separately since it's a File and not parsable from Object.fromEntries directly
    const imageFile = formData.get("image") as File | null;

    if (!imageFile || !(imageFile instanceof File)) {
      return { message: "Image upload failed. No file provided." };
    }

    // Validate fields using your Zod schemas
    const validatedFields = validateWithZodSchema(productSchema, formEntries);
    validateWithZodSchema(imageSchema, { image: imageFile });

    // Prepare image for upload
    const imageName = `${Date.now()}-${imageFile.name}`.replace(/\s+/g, "-");
    const imagePath = `products-images/${imageName}`;

    // Upload image
    const supabase = await createSupabaseServerClient();
    const { error: uploadError } = await supabase.storage
      .from("products-images")
      .upload(imagePath, imageFile);

    if (uploadError) {
      console.error("Image upload error:", uploadError);
      return { message: "Image upload failed" };
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("products-images")
      .getPublicUrl(imagePath);

    const imageUrl = publicUrlData?.publicUrl ?? "";

    const now = new Date().toISOString();

    // Insert product
    const { error: insertError } = await supabase.from("products").insert([
      {
        ...validatedFields,
        image: imageUrl,
        createdAt: now,
        updatedAt: now,
        clerkId: userId,
      },
    ]);

    if (insertError) {
      console.error("Insert error:", insertError);
      return { message: "Product creation failed" };
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    return { message: "Something went wrong while creating product." };
  }
  redirect("/admin/products");
};

export const createReview = async (
  prevState: unknown,
  formData: FormData
): Promise<{ message: string }> => {
  const supabase = await createSupabaseServerClient();
  const { userId } = await auth();
  const userr = await getAuthUser();

   const rawData = {
      productid: formData.get("productId"),
      authorname: formData.get("authorName") || userr.firstName || "user",
      authorimageurl: formData.get("authorImageUrl") || userr.imageUrl || "",
      rating: formData.get("rating"),
      comment: formData.get("comment"),
      clerkid: userId,
    };

    const parsed = reviewSchema.parse(rawData);

  
  if (!userId) return { message: "Not authenticated" };
  try {
     const now = new Date().toISOString();
   
    const { error } = await supabase.from("Review").insert({
      productid: parsed.productid,
      authorname: parsed.authorname,
      authorimageurl: parsed.authorimageurl,
      rating: parsed.rating,
      comment: parsed.comment,
      updatedat: now,
      clerkid: parsed.clerkid,
    });

    if (error) {
      console.error("Supabase error:", error.message);
      console.log(error.message);

      return { message: "Failed to submit review. Please try again." };
    }

    return { message: "Review submitted successfully!" };
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      console.error("Validation error:", error.errors);
      return { message: error.errors[0]?.message || "Invalid input" };
    }

    if (error instanceof Error) {
      console.error("Unexpected error:", error.message);
      return { message: "Something went wrong while submitting your review." };
    }

    // fallback for truly unknown errors
    console.error("Unknown error:", error);
    return { message: "An unknown error occurred." };
  }
};

export const fetchProductReviews = async (productId: string) => {
 try {
    const user = await getAuthUser();
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("Review")
      .select("id, rating, comment, authorname, authorimageurl, createdat, clerkid,updatedat")
      .eq("productid", productId)
      .eq("clerkid", user.id);

    if (error) {
      console.error("Supabase error object:", JSON.stringify(error, null, 2));
      throw new Error("Failed to fetch favorite for user and product");
    }
    
    return data ?? [];
  } catch (error) {
    console.error("Unexpected error in fetchFavoriteId:", error);
    throw new Error("Server error while fetching favorite");
  }

};

export const fetchProductReviewsByUser = async ({
  productId,
}: {
  productId: string;
}) => {};

export const deleteProductReviews = async (productId: string) => {};

export const findExistingReview = async (productId: string) => {};

export const fetchProductRating = async (productId: string) => {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("Review")
    .select("rating")
    .eq("productid", productId);

  if (error) {
    console.error("Error fetching product ratings:", error.message);
    return { averageRating: 0, totalRatings: 0 };
  }

  const ratings = data.map((review) => review.rating as number);
  const totalRatings = ratings.length;
  const averageRating =
    totalRatings > 0
      ? ratings.reduce((acc, curr) => acc + curr, 0) / totalRatings
      : 0;

  return {
    averageRating: Number(averageRating.toFixed(1)),
    totalRatings,
  };
};

export const deleteProduct = async (productId: string) => {
  try {
    const user = await getAuthUser();

    let isAdmin = false;
    try {
      await getAdminUser();
      isAdmin = true;
    } catch {
      isAdmin = false;
    }
    const supabase = await createSupabaseServerClient();
    const { data: product, error } = await supabase
      .from("products")
      .select("clerkId")
      .eq("id", productId)
      .single();

    if (error || !product) {
      console.error("Product not found or fetch error", error);
      throw new Error("Product not found");
    }

    const isOwner = product.clerkId === user.id;

    if (!isAdmin && !isOwner) {
      throw new Error("Unauthorized to delete this product");
    }

    const { error: deleteError } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);

    revalidatePath("/admin/products");

    if (deleteError) {
      console.error("Delete error:", deleteError);
      throw new Error("Failed to delete product");
    }

    return { message: "Product deleted successfully" };
  } catch (error) {
    console.error("Unexpected error in deleteProduct:", error);
    throw new Error("Error deleting product");
  }
};

export const fetchAdminProducts = async () => {
  try {
    const adminUser = await getAdminUser();
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("clerkId", adminUser.id)
      .order("createdAt", { ascending: false });

    if (error) {
      console.error("Error fetching admin products:", error);
      throw new Error("Failed to fetch admin products");
    }

    return data;
  } catch (err) {
    console.error("Unexpected error in fetchAdminProducts:", err);
    throw new Error("Server error while fetching admin products");
  }
};

export const fetchAdminProductDetails = async (productId: string) => {
  const user = await getAuthUser();

  let isAdmin = false;
  try {
    await getAdminUser();
    isAdmin = true;
  } catch {
    isAdmin = false;
  }
  const supabase = await createSupabaseServerClient();
  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .single();

  if (error || !product) {
    console.error("Product not found or fetch error", error);
    redirect("/admin/products");
  }

  const isOwner = product.clerkId === user.id;
  if (!isAdmin && !isOwner) {
    redirect("/");
  }

  return product;
};

export const updateImageAction = async (
  _prevState: unknown,
  formData: FormData
): Promise<{ message: string }> => {
  const id = formData.get("id") as string;
  const file = formData.get("image") as File;

  if (!id || !file) {
    return { message: "Missing product ID or file" };
  }

  try {
    const user = await getAuthUser();
    let isAdmin = false;

    try {
      await getAdminUser();
      isAdmin = true;
    } catch {
      isAdmin = false;
    }
    const supabase = await createSupabaseServerClient();
    const { data: product, error } = await supabase
      .from("products")
      .select("clerkId")
      .eq("id", id)
      .single();

    if (error || !product) {
      console.error("Product not found", error);
      return { message: "Product not found" };
    }

    const isOwner = product.clerkId === user.id;
    if (!isAdmin && !isOwner) {
      return { message: "Unauthorized" };
    }

    // Upload new image to Supabase Storage
    const fileExt = file.name.split(".").pop();
    const filePath = `products/${id}-${Date.now()}.${fileExt}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("products-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    console.log(uploadData);

    if (uploadError) {
      console.error("Upload error", uploadError.message);
      return { message: "Image upload failed" };
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("products-images")
      .getPublicUrl(filePath);

    const imageUrl = publicUrlData?.publicUrl;

    if (!imageUrl) {
      return { message: "Failed to get public URL" };
    }

    // Update product with new image URL
    const { error: updateError } = await supabase
      .from("products")
      .update({ image: imageUrl })
      .eq("id", id);

    if (updateError) {
      console.error("Update image URL failed", updateError);
      return { message: "Image update failed" };
    }

    revalidatePath("/admin/products");
    return { message: "Image updated successfully" };
  } catch (error) {
    console.error("Unexpected error", error);
    return { message: "Unexpected error occurred" };
  }
};

export const updateProductAction = async (
  prevState: unknown,
  formData: FormData
) => {
  try {
    const id = formData.get("id") as string;

    if (!id) {
      return { message: "Missing product ID" };
    }

    const formEntries = Object.fromEntries(formData.entries());
    const validatedInput = {
      name: formEntries.name,
      company: formEntries.company,
      description: formEntries.description,
      featured: formEntries.featured === "on",
      price: Number(formEntries.price),
    };

    const validatedFields = validateWithZodSchema(
      productSchema,
      validatedInput
    );
    // Auth
    const user = await getAuthUser();

    let isAdmin = false;
    try {
      await getAdminUser();
      isAdmin = true;
    } catch {
      isAdmin = false;
    }
    const supabase = await createSupabaseServerClient();
    const { data: product, error } = await supabase
      .from("products")
      .select("clerkid")
      .eq("id", id)
      .single();

    if (error || !product) {
      console.error("Product not found or fetch error", error);
      return { message: "Product not found" };
    }

    const isOwner = product.clerkid === user.id;
    if (!isAdmin && !isOwner) {
      return { message: "Unauthorized" };
    }

    // Update product
    const { error: updateError } = await supabase
      .from("products")
      .update(validatedFields)
      .eq("id", id);

    if (updateError) {
      console.error("Update error:", updateError);
      return { message: "Failed to update product" };
    }

    revalidatePath("/admin/products");

    return { message: "Product updated successfully" };
  } catch (error) {
    console.error("Unexpected error in updateProductAction:", error);
    return { message: "Unexpected error occurred" };
  }
};

export const toggleFavoriteAction = async (
  prevState: unknown,
  formData: FormData
) => {
  const productid = formData.get("productId") as string;
  const favoriteId = formData.get("favoriteId") as string;
  const pathName = formData.get("pathName") as string;
  const supabase = await createSupabaseServerClient();

  const { userId } = await auth();

  if (!userId) return { message: "Not authenticated" };

  try {
    if (favoriteId) {
      const { error } = await supabase
        .from("Favorite")
        .delete()
        .eq("id", favoriteId);
      if (error) throw new Error("Delete failed");

      revalidatePath(pathName);
      return { message: "Removed from favorites" };
    } else {
      const now = new Date().toISOString();
      const { error } = await supabase.from("Favorite").insert([
        {
          productid,
          clerkid: userId,
          created_at: now,
          updated_at: now,
        },
      ]);

      if (error) throw new Error("Insert failed");

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
