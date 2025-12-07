"use client";
import React, { useMemo } from "react";
import Image from "next/image";
import { StarIcon } from "@heroicons/react/24/solid";
import { useDispatch } from "react-redux";
import { addToBasket } from "@/slices/basketSlice";
import { useToast } from "@/components/Toast/ToastContext";

interface ProductProps {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

function Product({
  id,
  title,
  price,
  description,
  category,
  image,
}: ProductProps) {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  // Generate deterministic rating based on product ID to avoid hydration mismatch
  const rating = useMemo(() => {
    // Simple hash function to generate consistent rating per product ID
    const hash = id
      .toString()
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (hash % 5) + 1;
  }, [id]);

  const hasPrime = useMemo(() => {
    const hash = id
      .toString()
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return hash % 2 === 0;
  }, [id]);

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
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

  return (
    <div className="relative flex flex-col m-5 bg-white z-30 p-10">
      <p className="absolute top-2 right-2 text-xs italic text-gray-400">
        {category}
      </p>
      <Image
        src={image}
        alt={title}
        width={200}
        height={200}
        objectFit="contain"
        className="mx-auto"
      />
      <h4 className="my-3">{title}</h4>
      <div className="flex">
        {Array(rating)
          .fill(0)
          .map((_, i) => (
            <StarIcon className="h-5 text-yellow-500" key={i} />
          ))}
      </div>
      <p className="text-xs my-2 line-clamp-2">{description}</p>
      <p className="mb-5">{formattedPrice}</p>
      {hasPrime && (
        <div className="flex items-center space-x-2 -mt-5">
          <img
            src="https://links.papareact.com/fdw"
            alt="prime"
            className="w-12"
          />
          <p className="text-xs text-gray-500">FREE Next-day Delivery</p>
        </div>
      )}
      <button
        onClick={addItemToBasket}
        className="mt-auto button cursor-pointer"
      >
        Add to Basket
      </button>
    </div>
  );
}

export default Product;
