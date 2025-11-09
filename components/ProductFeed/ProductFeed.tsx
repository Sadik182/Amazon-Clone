import React from "react";
import Product from "./Product";

interface ProductType {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

interface ProductFeedProps {
  products: ProductType[];
}

function ProductFeed({ products }: ProductFeedProps) {
  return (
    <div className="grid grid-flow-row-dense md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mx-auto md:-mt-52">
      {products.slice(0, 4).map((product) => (
        <Product
          key={product.id}
          id={product.id}
          title={product.title}
          price={product.price}
          description={product.description}
          category={product.category}
          image={product.image}
        />
      ))}
      <img
        className="md:col-span-full"
        src="https://links.papareact.com/dyz"
        alt="ad"
      />
      <div className="md:col-span-2">
        {products.slice(4, 5).map((product) => (
          <Product
            key={product.id}
            id={product.id}
            title={product.title}
            price={product.price}
            description={product.description}
            category={product.category}
            image={product.image}
          />
        ))}
      </div>
      {products.slice(5, products.length).map((product) => (
        <Product
          key={product.id}
          id={product.id}
          title={product.title}
          price={product.price}
          description={product.description}
          category={product.category}
          image={product.image}
        />
      ))}
    </div>
  );
}

export default ProductFeed;
