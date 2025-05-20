import React from "react";
import { fetchFeaturedProducts } from "../../../utils/actions";
import EmptyList from "../global/EmptyList";
import SectionTitle from "../global/SectionTitle";
import ProductsGrid from "../products/ProductsGrid";

export default async function FeaturedProducts() {
  const porducts = await fetchFeaturedProducts();

  if(porducts.length === 0) return <EmptyList/>;
  return (
    <section className="pt-24">
      <SectionTitle text="featured products"/>
      <ProductsGrid products={porducts}/>
    </section>
  );
}
