'use client'

import { useTransition } from "react";
import { toast } from 'sonner';
import { deleteProduct } from "../../../utils/actions";
import { IconButton } from "./Buttons";

export default function DeleteProduct({productId}:{productId: string}){
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const res = await deleteProduct(productId);

      if (res.message === 'Product deleted successfully') {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    });
  };
  return (
     <IconButton
      actionType="delete"
      onClick={handleDelete}
      disabled={isPending}
    />
  )
};