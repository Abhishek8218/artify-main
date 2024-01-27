import {User} from '@models/User'
import { connectToDB } from '@mongodb/database'

const stripe = require('stripe')(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY)

async function getCartItems(line_items) {
  return new Promise((resolve, reject) => {
    let cartItems = []
    line_items?.data?.forEach(async (item) => {
      const product = await stripe.products.retrieve(item.price.product)
      const productId = product.metadata.productId
// console.log("line items in order route: ", item)
      cartItems.push({
        productId,
        title: product.name,
        price: item.price.unit_amount_decimal / 100,
        quantity: item.quantity,
        image: product.images[0],
      
      })
      // console.log("Order items:", cartItems);
      if (cartItems.length === line_items?.data?.length) {
        resolve(cartItems)
      }
    })
  })
  
}
export const POST = async (req, res) => {
  try {
    const rawBody = await req.text()
    const signature = req.headers.get("stripe-signature")

    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )
    // console.log("Webhook received event:", event);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object

      const line_items = await stripe.checkout.sessions.listLineItems( event.data.object.id )
      // console.log("Line items:", line_items);

      const orderItems = await getCartItems(line_items)
      const userId = session.client_reference_id

      const amountPaid = session.amount_total / 100

      const orderData = {
        id: session.payment_intent,
        user: userId,
        orderItems,
        amountPaid
      }

      await connectToDB()
      const user = await User.findById(userId)
      // console.log("Found user:", user);
      user.cart = []
      user.orders.push(orderData)
      await user.save()
      await user.save();
// console.log("User saved successfully");


      return new Response(JSON.stringify({ received: true }), { status: 200 })
    }
  } catch (err) {
    console.log(err)
    return new Response("Failed to create order"+ err.message, { status: 500 })
  }
}