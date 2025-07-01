import { Cart } from "../../../utils/cart";
import { formatCurrency } from "../../../utils/format";
import { createOrderAction } from "../../../utils/order";
import Buttons from "../form/Buttons";
import FormContainer from "../form/FormContainer";

import { Card, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";

const CartTotals = ({ cart }: { cart: Cart }) => {
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
      <FormContainer action={createOrderAction}>
        <Buttons text="Place Order" className="w-full mt-8"/>
      </FormContainer>
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
