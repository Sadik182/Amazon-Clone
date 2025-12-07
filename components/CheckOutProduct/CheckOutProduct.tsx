import React from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { addToBasket, removeFromBasket } from "@/slices/basketSlice";
import { useDispatch } from "react-redux";
import { useToast } from "@/components/Toast/ToastContext";
import Currency from "@/components/Currency/Currency";

interface CheckOutProductProps {
  id: number;
  basketId?: string;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  hasPrime: boolean;
  rating: number;
}

function CheckOutProduct({
  id,
  basketId,
  title,
  price,
  description,
  category,
  image,
  hasPrime,
  rating,
}: CheckOutProductProps) {
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const addItemToBasket = () => {
    const product = {
      id,
      title,
      price,
      description,
      category,
      image,
      hasPrime,
      rating,
    };
    dispatch(addToBasket(product));
    showToast(`${title} added to basket`, "success");
  };
  const removeItemFromBasket = () => {
    // Remove the item from the redux store using unique basketId
    if (basketId) {
      dispatch(removeFromBasket(basketId));
      showToast(`1 item removed from basket`, "error");
    }
  };
  return (
    <>
      <div className="grid grid-cols-5">
        <Image
          src={image}
          alt={title}
          width={200}
          height={200}
          objectFit="contain"
          className="w-48"
        />
        <div className="col-span-3 mx-5">
          <p>{title}</p>
          <p className="flex">
            {Array(rating)
              .fill(0)
              .map((_, i) => (
                <StarIcon className="h-5 text-yellow-500" key={i} />
              ))}
          </p>
          <p className="text-xs my-2 line-clamp-3">{description}</p>
          <p className="mb-2">
            <Currency amount={price} />
          </p>
          {hasPrime && (
            <div className="flex items-center space-x-2">
              <img
                src="https://links.papareact.com/fdw"
                alt="prime"
                className="w-12"
              />
              <p className="text-xs text-gray-500">FREE Next-day Delivery</p>
            </div>
          )}
        </div>
        <div className="flex flex-col space-y-2 justify-self-end my-auto">
          <button className="button cursor-pointer" onClick={addItemToBasket}>
            Add to Basket
          </button>
          <button
            className="button cursor-pointer"
            onClick={removeItemFromBasket}
          >
            Remove from Basket
          </button>
        </div>
      </div>
    </>
  );
}

export default CheckOutProduct;
