import db from "./db";

export const fetchFeaturedProducts = async() => {
  const products = await db.product.findMany({
    where: {
        featured: true
    }
  });

  return products;
};

export const fetchAllProducts = () => {
  const products = db.product.findMany({
    orderBy: {
        createdAt: 'desc'
    }
  });

  return products;
};