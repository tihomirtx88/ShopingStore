import React from "react";
import { fetchAllProducts } from "../../../utils/actions";
import ProductsGrid from "./ProductsGrid";
import { Button } from "../ui/button";
import Link from "next/link";
import { LuLayoutGrid, LuList } from "react-icons/lu";
import { Separator } from "@radix-ui/react-dropdown-menu";
import ProductsList from "./ProductsList";

export default async function ProductsContainer({
  layout,
  search,
}: {
  layout: string;
  search: string;
}) {
  const products = await fetchAllProducts({search});
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
        <Separator className="mt-4"/>
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
          <ProductsList products={products} />
        )}
      </div>
    </>
  );
}
