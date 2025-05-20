import BreadCrumbps from "@/components/single-product/BreadCrumbps";
import { fetchsingleProduct } from "../../../../utils/actions";
import { formatCurrency } from "../../../../utils/format";
import Image from "next/image";
import FavoriteToggleButton from "@/components/products/FavoriteToggleButton";
import ProductRating from "@/components/single-product/ProductRating";
import AddtoCart from "@/components/single-product/AddtoCart";

export default async function SingleProductPage({params,}: {params: { id: string };
}) {
  const product = await fetchsingleProduct(params.id);
  const { name, company, price, image, description } = product;
  const dollarsAmount = formatCurrency(price);
  return <section>
    <BreadCrumbps name={product.name}/>
    <div className="mt-6 grid gap-y-8 lg:grid-cols-2 lg:gap-x-16">
        {/* Image */}
        <div className="relative h-full">
            <Image src={image} alt={name} fill sizes='(max-width:768px) 100vw,(max-width:1200px) 50vw, 33vw' priority className="rounded w-full object-cover"/>
        </div>
            {/* PRODUCT INFO SECOND COL */}
        <div>
          <div className='flex gap-x-8 items-center'>
            <h1 className='capitalize text-3xl font-bold'>{name} </h1>
            <div className='flex items-center gap-x-2'>
              <FavoriteToggleButton productId={params.id} />
              {/* <ShareButton name={product.name} productId={params.id} /> */}
            </div>
          </div>
          <ProductRating productId={params.id} />
          <h4 className='text-xl mt-2'>{company}</h4>
          <p className='mt-3 text-md bg-muted inline-block p-2 rounded'>
            {dollarsAmount}
          </p>
          <p className='mt-6 leading-8 text-muted-foreground'>{description}</p>
          <AddtoCart productId={params.id} />
        </div>
    </div>
  </section>;
}
