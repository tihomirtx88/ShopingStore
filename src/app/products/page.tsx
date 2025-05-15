import ProductsContainer from "@/components/products/ProductsContainer";

function ProductsPage({searchParams}: {searchParams: {layout?:String, search?:string}}) {
  const layout = searchParams.layout || 'grid';
  const search = searchParams.search || '';

    return (
     <ProductsContainer layout={layout} search={search}/>
    );
  }
  export default ProductsPage;