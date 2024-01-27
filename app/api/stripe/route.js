import Stripe from "stripe";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export const POST = async (req, res) => {
  if (req.method === "POST") {
    const { cart, userId } = await req.json()
    try {
      const params = {
        submit_type: "pay",
        mode: "payment",
        payment_method_types: ["card"],
        billing_address_collection: "auto",
        shipping_options: [
          { shipping_rate: "shr_1OcoMFSDvAGbwgiVJKTQ3o9p" },
          { shipping_rate: "shr_1OcoLVSDvAGbwgiV6yNSpslZ" },
        ],
        line_items: cart?.map((item) => {
          let imageUrls = [];

          // Check if item.image is an array before mapping
          if (Array.isArray(item.image)) {
            // imageUrls = item.image.map((buffer) => {
            //   const base64Image = Buffer.from(buffer).toString("base64");
            //   return `data:image/*;base64,${base64Image}`;
            // });
            imageUrls = item.image;
          }
          return {
          
            price_data: {
              currency: "inr",
              product_data: {
                name: item.title,
                images: imageUrls,
                // images: `${req.headers.get("origin")}/${item.image}`,
                // images:[`${item.images}`],
                metadata: {
                  productId: item.workId
                }
              },
              unit_amount: item.price * 100,
            },
            quantity: 1,
          }
        }),
        client_reference_id: userId,
        mode: "payment",
        success_url: `${req.headers.get("origin")}/success`,
        cancel_url: `${req.headers.get("origin")}/canceled`,
      };
      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create(params);

      return new Response(JSON.stringify(session), { status: 200 });
    } catch (err) {
      console.log(err);
      return new Response("Failed to chaeckout", { status: 500 });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}