import React from 'react'
import { fetchAdminProductDetails, updateProductAction } from '../../../../../../utils/actions';
import FormContainer from '@/components/form/FormContainer';
import FormInput from '@/components/form/FormInput';
import PriceInput from '@/components/form/PriceInput';
import TextArea from '@/components/form/TextArea';
import CheckBox from '@/components/form/CheckBox';

export default async function EditProductPage({params}: {params: {id: string}}) {
  const { id } = params;
  const product = await fetchAdminProductDetails(id);
  const { name, company, description, featured, price} = product;
  return (
    <section>
      <h1 className='text-2xl font-semibold mb-8 capitalize'>Update Product</h1>
      <div className='border rounded p-8'>
        {/* Image input container */}
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
        {/* <SubmitButton text='update product' className='mt-8 '/> */}
        </FormContainer>
      </div>
    </section>
  )
}
