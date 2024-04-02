import { useContext, useEffect, useState } from "react";
import { CartContext } from "../CartContext";
import { Link } from "react-router-dom";

function Cart() {
  const [total, setTotal] = useState(0);
  const [purchaseError, setPurchaseError] = useState(false);
  const cart = useContext(CartContext);
  console.log(cart.items);

  const checkout = async () => {
    const res = await fetch("api/booking/checkout-seesion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cart.items),
    });
    const data = await res.json();
    if (!data.url) setPurchaseError(data.message);
    window.location.assign(data.url);
  };

  useEffect(() => {
    setTotal(cart.getTotalCost);
  }, [cart]);

  return (
    <div className="p-3 max-w-lg mx-auto flex flex-col">
      <h1 className="text-3xl font-semibold text-center my-7 text-sky-800">
        Shoping Cart
      </h1>
      {cart.items.map((prod) => (
        <div
          key={prod.id}
          className="border rounded-lg p-3 flex justify-between items-center gap-4"
        >
          <Link to={`/listing/${prod.id}`}>
            <img
              src={prod.image}
              alt="listing cover"
              className="h-16 w-16 object-contain"
            />
          </Link>
          <Link
            className="text-slate-700 font-semibold  hover:underline truncate flex-1"
            to={`/listing/${prod.id}`}
          >
            <p>{prod.name}</p>
          </Link>
          <p>{prod.quantity}</p>
          <p>{prod.price}</p>
          <div className="flex flex-col item-center">
            <button
              onClick={() => cart.deleteFromCart(prod.id)}
              className="text-red-700 uppercase"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
      <p className="text-xl text-center font-semibold my-7">Total: {total}</p>
      <button
        onClick={checkout}
        className="bg-sky-800 text-white rounded-lg p-2 uppercase hover:opacity-95 disabled:opacity-80"
      >
        Purchase
      </button>
      {purchaseError ? "Somthing went wrong with purchase" : null}
    </div>
  );
}

export default Cart;
