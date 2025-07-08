import { NextRequest } from "next/server";
import Stripe from "stripe";
import { createSupabaseServerClient } from "../../../../utils/supabase-server";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export const GET = async (req: NextRequest) => {
  const supabase = await createSupabaseServerClient();
  try {
    // 1. Extract session_id from URL
    const { searchParams } = new URL(req.url);
    const session_id = searchParams.get("session_id");

    if (!session_id) {
      return Response.json({ error: "Missing session_id" }, { status: 400 });
    }

    // 2. Retrieve Stripe session
    const session = await stripe.checkout.sessions.retrieve(session_id);

    const orderId = session.metadata?.orderId;
    const cartId = session.metadata?.cartId;

    if (!orderId || !cartId) {
      return Response.json({ error: "Missing metadata" }, { status: 400 });
    }

    // 3. Update order as paid if Stripe session is completed
    if (session.status === "complete") {
      const { error: updateError } = await supabase
        .from("Order")
        .update({ isPaid: true })
        .eq("id", orderId);

      if (updateError) {
        console.error("Failed to update order:", updateError.message);
        return Response.json(
          { error: "Failed to update order" },
          { status: 500 }
        );
      }
    }

    // 4. Delete cart
    const { error: deleteError } = await supabase
      .from("Cart")
      .delete()
      .eq("id", cartId);

    if (deleteError) {
      console.error("Failed to delete cart:", deleteError.message);
      return Response.json({ error: "Failed to delete cart" }, { status: 500 });
    }

      return new Response(null, {
      status: 302,
      headers: {
        Location: "/orders",
      },
    });
    
  } catch (error) {
    console.error("Confirm error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
