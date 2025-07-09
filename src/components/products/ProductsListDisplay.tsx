import React from "react";
import { formatCurrency } from "../../../utils/format";
import Link from "next/link";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";

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

export function ProductsListDisplay({ products }: { products: Product[] }) {
  return (
    <div className="mt-12 grid gap-y-8">
      {products.map((product) => {
        const { name, price, image, company } = product;
        const dollarsAmount = formatCurrency(price);
        const porductId = product.id;
        return (
          <article key={porductId} className="group relative">
            <Link href={`/products/${porductId}`}>
             <Card
  className="
    cursor-pointer
    transition-all duration-300
    border 
    bg-gray-900 dark:bg-zinc-900
    text-[hsl(var(--foreground))] 
    border-gray-300 dark:border-zinc-700
    hover:shadow-lg hover:brightness-105
  "
>
                <CardContent className="p-8 gap-y-4 grid md:grid-cols-3">
                  <div className="relative h-64 md:h-48 md:w-48">
                    <Image
                      src={image}
                      alt={name}
                      fill
                      sizes="(max-width:768px) 100vw,(max-width:1200px) 50vw, 33vw "
                      priority
                      className="w-full rounded object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold capitalize">{name}</h2>
                    <h4 className="text-muted-foreground">{company}</h4>
                  </div>
                  <p
                    className="text-lg md:ml-auto"
                    style={{ color: "hsl(var(--muted-foreground))" }}
                  >
                    {dollarsAmount}
                  </p>
                </CardContent>
              </Card>
            </Link>
          </article>
        );
      })}
    </div>
  );
}
