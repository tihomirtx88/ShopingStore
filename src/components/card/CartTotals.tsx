// import { Card, CardTitle } from '@/components/ui/card';
// import { Separator } from '@/components/ui/separator';
// import { formatCurrency } from '@/utils/format';
// import { createOrderAction } from '@/utils/actions';
// import FormContainer from '../form/FormContainer';
// import { SubmitButton } from '../form/Buttons';
// import { Cart } from '@prisma/client';

import { Cart } from "../../../utils/cart";
import { formatCurrency } from "../../../utils/format";

import { Card, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";

const CartTotals = ({ cart }: { cart: Cart }) => {
  console.log(cart);
  const { cartTotal, shipping, tax, orderTotal } = cart

  return (
    <div>
      <Card className="p-8">
        <CartTotalRow label="Subtotal" amount={cartTotal} />
        <CartTotalRow label="Shipping" amount={shipping} />
        <CartTotalRow label="Tax" amount={tax} />
        <CardTitle className="mt-8">
          <CartTotalRow label="Order Total" amount={orderTotal} lastRow />
        </CardTitle>
      </Card>
    </div>
  );
};

function CartTotalRow({
  label,
  amount,
  lastRow,
}: {
  label: string;
  amount: number;
  lastRow?: boolean;
}) {
  return (
    <>
      <p className="flex justify-between text-sm">
        <span>{label}</span>
        <span>{formatCurrency(amount)}</span>
      </p>
      {lastRow ? null : <Separator className="my-2" />}
    </>
  );
}

export default CartTotals;
