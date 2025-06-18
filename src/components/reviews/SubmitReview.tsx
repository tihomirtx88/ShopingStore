"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import FormContainer from "../form/FormContainer";
import { createReview } from "../../../utils/actions";
import RatingInput from "./RatingInput";
import TextArea from "../form/TextArea";
import Buttons from "../form/Buttons";

export default function SubmitReview({ productId }: { productId: string }) {
  const [isReviewFormVisible, setIsReviewFormVisible] = useState(false);
  const { user } = useUser();
  return (
    <div>
      <Button
        size="lg"
        className="capitalize"
        onClick={() => setIsReviewFormVisible((prev) => !prev)}
      >
        leave review
      </Button>
      {isReviewFormVisible && (
        <Card className='p-8 mt-8'>
            <FormContainer action={createReview}>
               <input type='hidden' name='productId' value={productId} />
               <input
                    type='hidden'
                    name='authorName'
                    value={user?.firstName || 'user'}
                />
                <input type='hidden' name='authorImageUrl' value={user?.imageUrl} />
                <RatingInput name='rating' />
                <TextArea
                    name='comment'
                    labelText='feedback'
                    defaultValue='Outstanding product!!!'
                />
                <Buttons className='mt-4' />
            </FormContainer>
        </Card>
      )}
    </div>
  );
}
