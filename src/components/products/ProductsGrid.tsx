import { formatCurrency } from "../../../utils/format";
import Link from "next/link";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import FavoriteToggleButton from "./FavoriteToggleButton";

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

export default function ProductsGrid({ products }: { products: Product[] }) {
  return (
    <div className="pt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => {
        const { name, price, image } = product;
        const productId = product.id;
        const dollarsAmount = formatCurrency(price);
        
        return (
          <article key={productId} className="group relative">
            <Link href={`/products/${productId}`}>
              <Card className="border-none transform group-hover:shadow-xl transition-shadow duration-500">
                <CardContent className="p-4">
                  <div className="relative h-64 md:h-48 rounded overflow-hidden">
                    {image ? (
                      <Image
                        src={image}
                        alt={name}
                        fill
                        sizes="(max-width:768px) 100vw,(max-width:1200px) 50vw, 33vw"
                        priority
                        className="rounded w-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="bg-gray-200 w-full h-full rounded" />
                    )}
                  </div>
                  <div className="mt-4 text-center">
                    <h3 className="text-lg capitalize">{name}</h3>
                    <p
                      className="text-muted-foreground mt-2"
                      style={{ color: "hsl(var(--muted-foreground))" }}
                    >
                      {dollarsAmount}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <div className="absolute top-14 right-7 z-5">
              <FavoriteToggleButton productId={productId} />
            </div>
          </article>
        );
      })}
    </div>
  );
}
