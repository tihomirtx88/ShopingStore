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
  const toogleAvtion = toggleFavoriteAction.bind(null, {productId, favoriteId, pathName});
  return (
    <FormContainer action={toogleAvtion}>
      <CardSubmitbutton isFavorite={favoriteId? true:false}/>
    </FormContainer>
  );
}
