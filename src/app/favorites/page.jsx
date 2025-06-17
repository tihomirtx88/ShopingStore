import SectionTitle from "@/components/global/SectionTitle";
import { fetchUserFavroite } from "../../../utils/actions";
import ProductsGrid from "@/components/products/ProductsGrid";

async function FavoritesPage() {
  const favorites = await fetchUserFavroite();
  if(favorites.length === 0) return <SectionTitle text="You not have favroites yet"/>
  return (
    <div>
      <SectionTitle text="Favroites"/>
      <ProductsGrid products={favorites.map((favorite) => favorite.productid)}/>
    </div>
  );
}
export default FavoritesPage;
