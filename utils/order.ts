"use server";

import { redirect } from "next/navigation";
import { getAuthUser } from "./auth";
import { createSupabaseServerClient } from "./supabase-server";

export const createOrderAction = async ( prevState: unknown,
  formData: FormData): Promise<{ message: string }>=> {
   return {message: 'create order'}
};