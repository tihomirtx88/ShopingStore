import { redirect } from "next/navigation";
import db from "./db";

export const fetchFeaturedProducts = async() => {
  const products = await db.product.findMany({
    where: {
        featured: true
    }
  });

  return products;
};

export const fetchAllProducts = ({search=''}:{search:string}) => {
  const products = db.product.findMany({
    where: {
      OR:[
        {name:{contains: search, mode: 'insensitive'}},
        {company:{contains: search, mode: 'insensitive'}}
      ]
    },
    orderBy: {
        createdAt: 'desc'
    }
  });

  return products;
};

export const fetchsingleProduct = async (productId: string) => {
  const product = await db.product.findUnique({
    where: {
      id: productId
    }
  });
  
  if(!product) redirect('/products');
  return product;
};