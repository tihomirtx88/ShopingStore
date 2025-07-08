//
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
// import { type NextRequest } from 'next/server';
// import db from '@/utils/db';

import { NextRequest } from "next/server";
import Stripe from "stripe";
import { createSupabaseServerClient } from "../../../../utils/supabase-server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export const POST = async (req: NextRequest) => {
  const supabase = await createSupabaseServerClient();

  const requestHeaders = new Headers(req.headers);
  const origin = requestHeaders.get("origin");

  const { orderId, cartId } = await req.json();

  // 1. Fetch the order
  const { data: order, error: orderError } = await supabase
    .from("Order")
    .select("*")
    .eq("id", orderId)
    .single();

  // 2. Fetch the cart and include cart items with products
  const { data: cart, error: cartError } = await supabase
    .from("Cart")
    .select(
      `
    *,
    cartItems:CartItem (
      *,
      product:products (*)
    )
  `
    )
    .eq("id", cartId)
    .single();

  if (!order || !cart || orderError || cartError) {
    return Response.json(null, {
      status: 404,
      statusText: "Order or Cart not found",
    });
  }
  
  if (!order || !cart) {
    return Response.json(null, {
      status: 404,
      statusText: "Not Found",
    });
  }

  // 3. Build Stripe line_items from cart
  const line_items = cart.cartItems.map((item: any) => ({
    quantity: item.amount,
    price_data: {
      currency: "usd",
      product_data: {
        name: item.product.name,
        images: [item.product.image],
      },
      unit_amount: item.product.price * 100, // cents
    },
  }));

  try {
    // 4. Create checkout session
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      metadata: { orderId, cartId },
      line_items,
      mode: "payment",
      return_url: `${origin}/api/confirm?session_id={CHECKOUT_SESSION_ID}`,
    });

    // 5. Return session client secret
    return Response.json({ clientSecret: session.client_secret });
  } catch (error) {
    console.error("Stripe session error:", error);
    return Response.json(null, {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
};
