import BreadCrumbps from "@/components/single-product/BreadCrumbps";
import { fetchsingleProduct } from "../../../../utils/actions";
import { formatCurrency } from "../../../../utils/format";
import Image from "next/image";
import FavoriteToggleButton from "@/components/products/FavoriteToggleButton";
import ProductRating from "@/components/single-product/ProductRating";
import AddtoCart from "@/components/single-product/AddtoCart";
import ShareButton from "@/components/single-product/ShareButton";
import SubmitReview from "@/components/reviews/SubmitReview";
import ProductReviews from "@/components/reviews/ProductReviews";
import { auth } from "@clerk/nextjs/server";
// import ProductReviews from "@/components/reviews/ProductReviews";


type Props = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export default async function SingleProductPage(props: Props) {
  const { id } = await props.params;
  const product = await fetchsingleProduct(id);
  const { name, company, price, image, description } = product;
  const dollarsAmount = formatCurrency(price);

    const { userId } = await auth();

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
              <FavoriteToggleButton productId={id} />
              <ShareButton name={product.name} productId={id}/>
            </div>
          </div>
          <ProductRating productId={id} />
          <h4 className='text-xl mt-2'>{company}</h4>
          <p className='mt-3 text-md bg-muted inline-block p-2 rounded'>
            {dollarsAmount}
          </p>
          <p className='mt-6 leading-8 text-muted-foreground'>{description}</p>
          <AddtoCart productId={id} />
        </div>
    </div>
    <ProductReviews productId={id}/>
    {userId && <SubmitReview productId={id} />}
  </section>;
}
