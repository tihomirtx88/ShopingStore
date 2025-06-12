import { auth } from "@clerk/nextjs/server";
import { CardSignInbutton } from "../form/Buttons";
import { fetchFavroiteId } from "../../../utils/actions";
import FavoriteToggleForm from "./FavoriteToggleForm";

export default async function FavoriteToggleButton( { productId } :{productId:string}) {
    
    const { userId } = await auth();
    if(!userId) return <CardSignInbutton/>;
    const favorite = await fetchFavroiteId({ productId });
    console.log(favorite, 'favoriteeeeeeee');
    
    const favoriteId = favorite?.id ?? null;

    return <FavoriteToggleForm productId={productId} favoriteId={favoriteId} />;
}
