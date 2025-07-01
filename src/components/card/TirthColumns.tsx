"use client";

import { useState } from "react";
import { toast } from "sonner";
import { removeCartItemAction, updateCartItemAction } from "../../../utils/cart";
import SelectProductAmount, { Mode } from "../single-product/SelectProductamount";
import FormContainer from "../form/FormContainer";
import Buttons from "../form/Buttons";

const TirthColumns = ({ quantity, id }: { quantity: number; id: string }) => {
  const [amount, setAmount] = useState(quantity);
  const [isLoading, setIsLoading] = useState(false);
  console.log(isLoading);
  

  const handleAmountChange = async (value: number) => {
    setIsLoading(true);
    toast.success("Calculating...");
   const result = await updateCartItemAction({
      amount: value,
      cartItemId: id,
    });
    setAmount(value);
    toast(result?.message);
    setIsLoading(false);
  };

   return (
    <div className='md:ml-8'>
      <SelectProductAmount
        amount={amount}
        setAmount={handleAmountChange}
        mode={Mode.CartItem}
        isLoading={false}
      />
      <FormContainer action={removeCartItemAction}>
        <input type='hidden' name='id' value={id} />
        <Buttons size='sm' className='mt-4' text='remove' />
      </FormContainer>
    </div>
  );
};

export default TirthColumns;
