'use server'; 

import { supabase } from "./supabase";

export const fetchFeaturedProducts = async() => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('featured', true);

    console.log(data);
    

  if (error) {
   console.log("Featured products fetch - data:", data);
console.log("Featured products fetch - error:", error);
    throw new Error('Failed to fetch featured products');
  }

  return data;
};

export const fetchAllProducts = async ({search=''}:{search:string}) => {
   const { data, error } = await supabase
    .from('products')
    .select('*')
    .or(
      `name.ilike.%${search}%,company.ilike.%${search}%`
    )
    .order('createdAt', { ascending: false });

  if (error) {
    console.error(error);
    throw new Error('Failed to fetch all products');
  }

  return data;
};

export const fetchsingleProduct = async (productId: string) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single();

  if (error || !data) {
    console.error(error || 'No product found');
  }

  return data;
};