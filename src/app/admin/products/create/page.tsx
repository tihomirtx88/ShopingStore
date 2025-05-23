import React from "react";
import { createProduct } from "../../../../../utils/actions";

import { Button } from "@/components/ui/button";
import { faker } from "@faker-js/faker";
import FormInput from "@/components/form/FormInput";

export default function CreateProductPage() {
  const name = faker.commerce.productName();
  // const company = faker.company.name();
  // const description = faker.lorem.paragraph({min: 10, max:12});

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-8 capitalize"></h1>
      <div className="border p-8 rounded-md">
        <form action={createProduct}>
          <FormInput type="text" name="name" label="product name" defaultValue={name}/>
          <Button type="submit" size='lg'>Submit</Button>
        </form>
      </div>
    </section>
  );
}
