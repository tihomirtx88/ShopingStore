import React from "react";
import { createProduct } from "../../../../../utils/actions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { faker } from "@faker-js/faker";

export default function CreateProductPage() {
  const name = faker.commerce.productName();
  const company = faker.company.name();
  const description = faker.lorem.paragraph({min: 10, max:12});

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-8 capitalize"></h1>
      <div className="border p-8 rounded-md">
        <form action={createProduct}>
          <div className="mb-2">
            <Label htmlFor="name">Product Name</Label>
            <Input id="name" name="name" type="text" defaultValue={name}/>
          </div>
          <Button type="submit" size='lg'>Submit</Button>
        </form>
      </div>
    </section>
  );
}
