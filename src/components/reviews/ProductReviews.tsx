import { fetchProductReviews } from "../../../utils/actions";
import SectionTitle from "../global/SectionTitle";
import ReveiwCard from "./ReveiwCard";

export default async function ProductReviews({
  productId,
}: {
  productId: string;
}) {
  const reviews = await fetchProductReviews(productId);

  return (
    <div className="mt-16">
      <SectionTitle text="product reviews" />
      <div className="grid md:grid-cols-2 gap-8 my-8">
        {reviews.map((review) => {
          const { comment, rating, authorimageurl, authorname } = review;
          const reviewInfo = {
            comment,
            rating,
            image: authorimageurl,
            name: authorname,
          };
          return <ReveiwCard key={review.id} reviewInfo={reviewInfo} />;
        })}
      </div>
    </div>
  );
}
