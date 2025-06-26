import SectionTitle from "@/components/global/SectionTitle";
import { fetchProductReviewsByUser } from "../../../utils/review";
import ReveiwCard from "@/components/reviews/ReveiwCard";
import DeleteReview from "@/components/reviews/DeleteReview";

async function ReviewsPage() {
  const reviews = await fetchProductReviewsByUser();

  if (reviews.length === 0) {
    return <SectionTitle text="you have no reviews yet" />;
  }

  return (
    <>
      <SectionTitle text="Your Reviews" />
      <section className="grid md:grid-cols-2 gap-8 mt-4">
        {reviews.map((review) => {
          const {
            id,
            rating,
            comment,
            authorname,
            authorimageurl,
            createdat,
            updatedat,
            product,
          } = review;
          const { name, image } = product;
          const reviewInfo = { comment, rating, name, image };
          return (
            <ReveiwCard key={review.id} reviewInfo={reviewInfo}>
              <DeleteReview reviewId={review.id} />
            </ReveiwCard>
          );
        })}
      </section>
    </>
  );
}
export default ReviewsPage;
