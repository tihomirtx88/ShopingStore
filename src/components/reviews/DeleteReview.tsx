import { deleteProductReviews } from "../../../utils/actions";
import FormContainer from "../form/FormContainer";
import { IconButton } from "../form/Buttons";

export default async function DeleteReview({ reviewId }: { reviewId: string }) {
  const deleteReview = await deleteProductReviews.bind(null, reviewId);
  return (
    <FormContainer action={deleteReview}>
      <IconButton actionType="delete" />
    </FormContainer>
  );
}
