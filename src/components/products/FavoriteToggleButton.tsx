import { auth } from "@clerk/nextjs/server";
import { CardSignInbutton } from "../form/Buttons";
import { fetchFavroiteId } from "../../../utils/actions";
import FavoriteToggleForm from "./FavoriteToggleForm";

export default async function FavoriteToggleButton( { productId } :{productId:string}) {
    
    const { userId } = await auth();
    if(!userId) return <CardSignInbutton/>;
    const favorites = await fetchFavroiteId({ productId });
    const favoriteId = favorites?.[0]?.id ?? null;

    return(
        <FavoriteToggleForm productId={productId} favoriteId={favoriteId}/>
    );
}
