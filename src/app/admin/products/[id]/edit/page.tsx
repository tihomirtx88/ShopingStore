import React from 'react'
import { fetchAdminProductDetails, updateImageAction, updateProductAction } from '../../../../../../utils/actions';
import FormContainer from '@/components/form/FormContainer';
import FormInput from '@/components/form/FormInput';
import PriceInput from '@/components/form/PriceInput';
import TextArea from '@/components/form/TextArea';
import CheckBox from '@/components/form/CheckBox';
import Buttons from '@/components/form/Buttons';
import ImageInputContainer from '@/components/form/ImageInputContainer';


type Props = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const product = await fetchAdminProductDetails(id);
  const { name, company, description, featured, price} = product;
  return (
    <section>
      <h1 className='text-2xl font-semibold mb-8 capitalize'>Update Product</h1>
      <div className='border rounded p-8'>
        {/* Image input container */}
        <ImageInputContainer name={name} image={product.image} text='update image' action={updateImageAction}>
          <input type="hidden" name='id' value={id} />
          <input type="hidden" name='url' value={product.image} />
        </ImageInputContainer>
        <FormContainer 
        action={updateProductAction}
        >
          <div className='grid gap-4 md:grid-cols-2 my-4'>
            <input type="hidden" name='id' value={id}/>
            <FormInput type='text' name='name' label='product name' defaultValue={name}/>
            <FormInput type='text' name='company' label='company name' defaultValue={company}/>
            <PriceInput defaultValue={price}/>
          </div>
        <TextArea name='description' labelText='product description' defaultValue={description}/>
        <div className='mt-6'>
           <CheckBox name='featured' label='featured' defaultChecked={featured}/>
        </div>
        <Buttons text='update product' className='mt-8 '/>
        </FormContainer>
      </div>
    </section>
  )
}
