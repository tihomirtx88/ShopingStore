'use client';

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import SelectProductAmount, { Mode } from "./SelectProductamount";
import Buttons, { ProductSignInButton } from "../form/Buttons";
import FormContainer from "../form/FormContainer";
import { addToCartAction } from "../../../utils/cart";

// import { useState } from 'react';
// import SelectProductAmount from './SelectProductAmount';
// import { Mode } from './SelectProductAmount';
// import FormContainer from '../form/FormContainer';
// import { SubmitButton } from '../form/Buttons';
// import { addToCartAction } from '@/utils/actions';
// import { useAuth } from '@clerk/nextjs';
// import { ProductSignInButton } from '../form/Buttons';

export default function AddtoCart({ productId }: { productId: string }) {
  const [amount, setAmount] = useState(1);
  const { userId } = useAuth();

  return (
    <div className="mt-4">
      <SelectProductAmount mode={Mode.SingleProduct} amount={amount} setAmount={setAmount}/>
      {userId ? <FormContainer action={addToCartAction}>
        <input type="hidden" name="productId" value={productId}/>
        <input type="hidden" name="amount" value={amount}/>
        <Buttons text='add to cart' className="mt-8"/>
      </FormContainer> : <ProductSignInButton/>}
    </div>
  );
}
