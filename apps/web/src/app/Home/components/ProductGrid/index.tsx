"use client";
import { Product } from "../../types";
import ProductCard from "../ProductCard";
import classes from "./style.module.css";

interface ProductGridProps {
  products: Product[];
  maxItems?: number;
}

const ProductGrid = ({ products, maxItems = 4 }: ProductGridProps) => {
  const displayProducts = products.slice(0, maxItems);

  return (
    <div className={classes.productsGrid}>
      {displayProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
