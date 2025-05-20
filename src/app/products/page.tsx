import ProductsContainer from "@/components/products/ProductsContainer";
import { fetchAllProducts } from "../../../utils/actions";

type Props = {
  searchParams: Promise<{ layout?: string; search?: string }>;
};

export const dynamic = "force-dynamic";

async function ProductsPage({ searchParams }: Props) {

  const { layout = 'grid', search = '' } = await searchParams;

  const products = await fetchAllProducts({ search });

    return (
     <ProductsContainer layout={layout} search={search} products={products}/>
    );
  }
  export default ProductsPage;