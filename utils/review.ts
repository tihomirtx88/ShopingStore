import { ZodError } from "zod";
import { auth } from "@clerk/nextjs/server";
import { getAuthUser } from "./auth";
import { reviewSchema } from "./schemas";
import { createSupabaseServerClient } from "./supabase-server";

export const createReview = async (_: unknown, formData: FormData) => {
  const supabase = await createSupabaseServerClient();
  const { userId } = await auth();
  const user = await getAuthUser();

  const rawData = {
    productid: formData.get("productId"),
    authorname: formData.get("authorName") || user.firstName || "user",
    authorimageurl: formData.get("authorImageUrl") || user.imageUrl || "",
    rating: formData.get("rating"),
    comment: formData.get("comment"),
    clerkid: userId,
  };

  try {
    const parsed = reviewSchema.parse(rawData);

    const { error } = await supabase.from("Review").insert({
      ...parsed,
      updatedat: new Date().toISOString(),
    });

    if (error) return { message: "Failed to submit review." };

    return { message: "Review submitted successfully!" };
  } catch (err) {
    if (err instanceof ZodError) return { message: err.errors[0]?.message };
    return { message: "Unexpected error submitting review." };
  }
};

export const fetchProductReviews = async (productId: string) => {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("Review")
      .select(
        "id, rating, comment, authorname, authorimageurl, createdat, clerkid,updatedat"
      )
      .eq("productid", productId);

    if (error) {
      console.error("Supabase error object:", JSON.stringify(error, null, 2));
      throw new Error("Failed to fetch reviews");
    }

    return data ?? [];
  } catch (error) {
    console.error("Unexpected error in fetchProductReviews:", error);
    throw new Error("Server error while fetching reviews");
  }
};

export const fetchProductReviewsByUser = async () => {
  try {
    const user = await getAuthUser(); // Throws if not logged in
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("Review")
      .select(
                `
          id,
          rating,
          comment,
          authorname,
          authorimageurl,
          createdat,
          updatedat,
          product:products!Review_productid_fkey (
            id,
            name,
            company,
            description,
            featured,
            image,
            price
          )
        `
              )
      .eq("clerkid", user.id);

    if (error) {
      console.error("Supabase error:", JSON.stringify(error, null, 2));
      throw new Error("Failed to fetch reviews by user");
    }

    return data ?? [];
  } catch (error) {
    console.error("Unexpected error in fetchProductReviewsByUser:", error);
    throw new Error("Server error while fetching user reviews");
  }
};

export const deleteProductReviews = async (reviewId: string) => {
  try {
    const supabase = await createSupabaseServerClient();
    const user = await getAuthUser();

    const { data: existingReview, error: fetchError } = await supabase
      .from("Review")
      .select("id, clerkid")
      .eq("id", reviewId)
      .single();

    if (fetchError) {
      console.error(
        "Error fetching review:",
        JSON.stringify(fetchError, null, 2)
      );
      throw new Error("Failed to verify review ownership");
    }

    if (!existingReview || existingReview.clerkid !== user.id) {
      throw new Error("Not authorized to delete this review");
    }

    // Perform the delete
    const { error: deleteError } = await supabase
      .from("Review")
      .delete()
      .eq("id", reviewId);

    if (deleteError) {
      console.error(
        "Error deleting review:",
        JSON.stringify(deleteError, null, 2)
      );
      throw new Error("Failed to delete review");
    }

    return { message: "Review deleted successfully" }; 
  } catch (error) {
    console.error("Unexpected error in deleteProductReviews:", error);
    throw new Error("Server error while deleting review");
  }
};


export const findExistingReview = async (
  userId: string,
  productId: string
): Promise<any | null> => {
  try {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("Review")
      .select("*")
      .eq("clerkid", userId)
      .eq("productid", productId)
      .single(); 

    if (error && error.code !== "PGRST116") {
      console.error("Supabase error:", error.message);
      throw new Error("Error fetching review");
    }

    return data ?? null;
    
  } catch (err) {
    console.error("Unexpected error in findExistingReview:", err);
    return null;
  }
};

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