import React from "react";
import { cookies } from "next/headers";
import axios from "axios";
import ProductImages from "./ProductImages";
import ProductActionButtons from "./ProductActionButtons";
import ProductReviews from "./ProductReviews";
import { Rate } from "antd";

async function getProduct(productid: string) {
  try {
    const cookiStore = cookies();
    const token = cookiStore.get("token")?.value;
    const endPoint = `${process.env.domain}/api/products/${productid}`;
    const response = await axios.get(endPoint, {
      headers: {
        Cookie: `token=${token}`,
      },
    });
    return response.data || [];
  } catch (error: any) {
    console.log(error.message);
    return [];
  }
}

async function ProductInfo({
  params,
}: {
  params: {
    productid: string;
  };
}) {
  const product = await getProduct(params.productid);
  return (
    <div className="mt-10 mx-2 md:px-10">
      {product && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <ProductImages product={product} />

          <div className="flex flex-col">
            <h1 className="text-2xl font-semibold">{product.name}</h1>

            <div className="text-gray-600 flex flex-col gap-2">
              {product.features.map((feature: any) => (
                <li key={feature} className="text-sm">
                  {feature}
                </li>
              ))}
            </div>
            <div className="my-5 flex flex-col">
              <span className="text-5xl">$ {product.price}</span>

              <span className="text-gray-500 mt-2 ml-1">
                {product.countInStock > 0
                  ? `${product.countInStock} in stock`
                  : "Out of stock"}
              </span>
            </div>
            <Rate
              disabled
              defaultValue={product.rating || 0}
              style={{
                color: "#26577C",
              }}
            />
            <ProductActionButtons product={product} />

            <div className="pt-10">
              <hr />
            </div>

            <ProductReviews product={product} />
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductInfo;
