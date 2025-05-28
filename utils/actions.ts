"use server";

import { auth } from "@clerk/nextjs/server";
import { supabase } from "./supabase";

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
  prevState: unknown,
  formData: FormData
): Promise<{ message: string }> => {
  //  try {
  //     const name = formData.get('name') as string;
  //     const company = formData.get('company') as string;
  //     const description = formData.get('description') as string;
  //     const featured = formData.get('featured') === 'on';
  //     const price = Number(formData.get('price'));

  //     const imageFile = formData.get('image') as File;

  //     if (!imageFile || !(imageFile instanceof File)) {
  //       return { message: 'Image upload failed. No file provided.' };
  //     }

  //     const imageName = `${Date.now()}-${imageFile.name}`.replace(/\s+/g, '-');
  //     const imagePath = `products-images/${imageName}`;

  //     // Upload image to Supabase Storage
  //     const { error: uploadError } = await supabase.storage
  //       .from('products-images')
  //       .upload(imagePath, imageFile);

  //     if (uploadError) {
  //       console.error(uploadError);
  //       return { message: 'Image upload failed' };
  //     }

  //     // Create public image URL
  //     const { data: publicUrlData } = supabase.storage
  //       .from('products-images')
  //       .getPublicUrl(imagePath);

  //     const imageUrl = publicUrlData?.publicUrl;

  //     // Insert into Supabase
  //     const { error: insertError } = await supabase
  //       .from('products')
  //       .insert([
  //         {
  //           name,
  //           company,
  //           description,
  //           featured,
  //           price,
  //           image: imageUrl,
  //         },
  //       ]);

  //     if (insertError) {
  //       console.error(insertError);
  //       return { message: 'Product creation failed' };
  //     }

  //     return { message: 'Product created successfully 🎉' };
  //   } catch (err) {
  //     console.error('Unexpected error:', err);
  //     return { message: 'Something went wrong while creating product.' };
  //   }
 try {
    const { userId } = await auth(); 
    if (!userId) {
      return { message: 'User not authenticated' };
    }

    const name = formData.get('name') as string;
    const company = formData.get('company') as string;
    const description = formData.get('description') as string;
    const featured = formData.get('featured') === 'on';
    const price = Number(formData.get('price'));
    const imageFile = formData.get('image') as File | null;

    let imageUrl = '';

    if (imageFile && imageFile instanceof File) {
      // Generate unique image name and path
      const imageName = `${Date.now()}-${imageFile.name}`.replace(/\s+/g, '-');
      const imagePath = `products-images/${imageName}`;

      // Upload image to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('products-images')
        .upload(imagePath, imageFile);

      if (uploadError) {
        console.error('Image upload error:', uploadError);
        return { message: 'Image upload failed' };
      }

      // Get public URL of the uploaded image
      const { data: publicUrlData } = supabase.storage
        .from('products-images')
        .getPublicUrl(imagePath);

      imageUrl = publicUrlData?.publicUrl ?? '';
    } else {
      return { message: 'Image upload failed. No file provided.' };
    }

    const now = new Date().toISOString();

    const { error: insertError } = await supabase
      .from('products')
      .insert([
        {
          name,
          company,
          description,
          featured,
          price,
          image: imageUrl,
          createdAt: now,
          updatedAt: now,
          clerkId: userId,
        },
      ]);

    if (insertError) {
      console.error('Insert error:', insertError);
      return { message: 'Product creation failed' };
    }

    return { message: 'Product created successfully 🎉' };
  } catch (err) {
    console.error('Unexpected error:', err);
    return { message: 'Something went wrong while creating product.' };
  }
};
