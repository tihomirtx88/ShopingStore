'use client'

import { usePathname } from "next/navigation";
import { toggleFavoriteAction } from "../../../utils/actions";
import FormContainer from "../form/FormContainer";
import { CardSubmitbutton } from "../form/Buttons";

type FavoritetoogleFormProps = {
  productId: string;
  favoriteId: string | null
};

export default function FavoriteToggleForm({productId, favoriteId}:FavoritetoogleFormProps) {
  const pathName = usePathname();

  return (
   <FormContainer action={toggleFavoriteAction}>
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="favoriteId" value={favoriteId ?? ""} />
      <input type="hidden" name="pathName" value={pathName} />
      <CardSubmitbutton isFavorite={!!favoriteId} />
    </FormContainer>
  );
}
