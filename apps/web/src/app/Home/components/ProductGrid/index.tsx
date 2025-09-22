"use client";
import { Product } from "@pawpal/prisma";
import ProductCard from "../ProductCard";
import classes from "./style.module.css";

interface ProductGridProps {
  products: Product[];
}

const ProductGrid = ({ products }: ProductGridProps) => {
  //TODO: ADD SHOW MORE LOGIC
  const displayProducts = products.slice(0, 4);

  return (
    <div className={classes.productsGrid}>
      {displayProducts.map((product) => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
