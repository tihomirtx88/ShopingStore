import React from "react";
import { FaStar } from "react-icons/fa";
import { fetchProductRating } from "../../../utils/actions";

export default async function ProductRating({
  productId,
}: {
  productId: string;
}) {
  const {averageRating, totalRatings} = await fetchProductRating(productId);

  const className = "flex items-center gap-1 text-md mt-1 mb-4";
  const countValue = `(${totalRatings}) reviews`;
  return (
    <span className={className}>
      <FaStar className="w-3 h-3" />
      {averageRating} {countValue}
    </span>
  );
}
