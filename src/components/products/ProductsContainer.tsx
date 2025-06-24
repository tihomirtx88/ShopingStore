import React from "react";
import ProductsGrid from "./ProductsGrid";
import { Button } from "../ui/button";
import Link from "next/link";
import { LuLayoutGrid, LuList } from "react-icons/lu";

import { ProductsListDisplay } from "./ProductsListDisplay";
import SeparatorWrapper from "../reviews/SeparatorWrapper";



interface Product {
  id: string;
  name: string;
  company: string;
  price: number;
  image: string;
  description?: string;
  featured?: boolean;
  createdAt?: string;
}


export default async function ProductsContainer({
  layout,
  search,
  products
}: {
  layout: string;
  search: string;
  products: Product[];
}) {
  // const products = await fetchAllProducts({search});
  const totalProducts = products.length;
  const searchTerm = search ? `&search=${search}` : "";

  return (
    <>
      {/* Header */}
      <section className="">
        <div className="flex justify-between items-center">
          <h4 className="font-medium text-lg">{totalProducts} porduct{totalProducts > 1 && 's'}</h4>
        </div>
        <div className="flex gap-x-4">
           <Button
              variant={layout === 'grid' ? 'default' : 'ghost'}
              size='icon'
              asChild
            >
              {/* To not losing the value from params */}
              <Link href={`/products?layout=grid${searchTerm}`}>
                <LuLayoutGrid />
              </Link>
            </Button>
            <Button
              variant={layout === 'list' ? 'default' : 'ghost'}
              size='icon'
              asChild
            >
                {/* To not losing the value from params */}
              <Link href={`/products?layout=list${searchTerm}`}>
                <LuList />
              </Link>
            </Button>
        </div>
        <SeparatorWrapper/>
      </section>
      {/* Products */}
      <div>
        {totalProducts === 0 ? (
          <h5 className="text-2xl mt-16">
            Sorry, no products matches on your search
          </h5>
        ) : layout === "grid" ? (
          <ProductsGrid products={products} />
        ) : (
          <ProductsListDisplay products={products} />
        )}
      </div>
    </>
  );
}
