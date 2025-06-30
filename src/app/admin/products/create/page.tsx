import React from "react";
import { createProduct } from "../../../../../utils/product";
import { faker } from "@faker-js/faker";
import FormInput from "@/components/form/FormInput";
import FormContainer from "@/components/form/FormContainer";
import PriceInput from "@/components/form/PriceInput";
import Imageinput from "@/components/form/Imageinput";
import TextArea from "@/components/form/TextArea";
import CheckBox from "@/components/form/CheckBox";
import Buttons from "@/components/form/Buttons";

export const dynamic = "force-dynamic";

export default function CreateProductPage() {
  const name = faker.commerce.productName();
  const company = faker.company.name();
  const description = faker.lorem.paragraph({min: 10, max:12});

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-8 capitalize"></h1>
      <div className="border p-8 rounded-md">
       <FormContainer action={createProduct}>
          <div className="grid gap-4 md:grid-cols-3 my-4">
            <FormInput name="name" type="text" label="product name" defaultValue={name}/>
            <FormInput type="text" name="company" label="company" defaultValue={company}/>
            <PriceInput/>
            <Imageinput/>
          </div>
          <TextArea name="description" labelText="product description" defaultValue={description}/>
          <div className="mt-6">
            <CheckBox name="featured" label="featured"/>
          </div>
          <Buttons text="create product" className="mt-8"/>
       </FormContainer>
      </div>
    </section>
  );
}
