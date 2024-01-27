"use client";

import {
  AddCircle,
  ArrowCircleLeft,
  Delete,
  RemoveCircle,
} from "@mui/icons-material";
import { useSession } from "next-auth/react";
import Loader from "@components/Loader";
import "@styles/Cart.scss";
import getStripe from "@lib/getStripe";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const Cart = () => {
  const { data: session, update } = useSession();
  const cart = session?.user?.cart;
  const userId = session?.user?._id;
  const router = useRouter();

  const updateCart = async (cart) => {
    const response = await fetch(`/api/user/${userId}/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cart }),
    });
    // console.log("cart data:- ", cart);

    const data = await response.json();
    update({ user: { cart: data } });
  };

  const removeFromCart = (cartItem) => {
    const newCart = cart.filter((item) => item.workId !== cartItem.workId);
    updateCart(newCart);
  };

  const handleCheckout = async () => {
    const stripe = await getStripe();

    const response = await fetch("/api/stripe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cart, userId }),
    });

    if (response.statusCode === 500) {
      return;
    }

    const data = await response.json();

    toast.loading("Redirecting to checkout...");

    const result = stripe.redirectToCheckout({ sessionId: data.id });

    if (result.error) {
      console.log(result.error.message);
      toast.error("Something went wrong");
    }
  };
  const navigateToWorkDetail = (workId) => {
    router.push(`/work-details?id=${workId}`); // Replace "/work" with the actual path of your work detail page
  };

  // console.log("cart data", cart);
  return !session?.user?.cart ? (
    <Loader />
  ) : (
    <>
      <div className="cart">
        <div className="details">
          <div className="top">
            <h1>Your Cart</h1>
          </div>

          {cart?.length === 0 && <h3>Empty Cart</h3>}

          {cart?.length > 0 && (
            <div className="all-items">
              {cart?.map((item, index) => (
                <div className="item" key={index}>
                  <div className="item_info">
                    <img
                      src={`data:image/*;base64,${Buffer.from(
                        item.image
                      ).toString("base64")}`}
                      alt="product"
                      onClick={() => navigateToWorkDetail(item.workId)}
                    />
                    <div className="text">
                      <h3>{item.title}</h3>
                      <p>Category: {item.category}</p>
                      <p>Seller: {item.creator.username}</p>
                    </div>
                  </div>

                  <div>
                    <h1>${item.price} </h1>
                  </div>

                  <div className="remove">
                    <span className="delete-icon">
                      <Delete onClick={() => removeFromCart(item)} />
                    </span>
                  </div>
                </div>
              ))}

              <div className="bottom">
                <a href="/">
                  <span className="back-icon">
                    <ArrowCircleLeft
                      sx={{ cursor: "pointer", fontSize: "30px" }}
                    />
                  </span>
                </a>
                <button onClick={handleCheckout}>CHECK OUT NOW</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;
