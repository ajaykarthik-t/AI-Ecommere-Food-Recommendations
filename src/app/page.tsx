import AddToCartBtn from "@/components/AddToCartBtn";
import Filters from "@/components/Filters";
import { ProductInterface } from "@/interfaces";
import { Rate } from "antd";
import axios from "axios";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";

async function getProducts(searchParams: any) {
  try {
    const cookiStore = cookies();
    const token = cookiStore.get("token")?.value;
    const category = searchParams.category || "";
    const search = searchParams.search || "";
    const endPoint = `${process.env.domain}/api/products?category=${category}&search=${search}`;
    const response = await axios.get(endPoint, {
      headers: {
        Cookie: `token=${token}`,
      },
    });
    return response.data.data || [];
  } catch (error: any) {
    console.log(error.message);
    return [];
  }
}

export default async function Home({ searchParams }: { searchParams: any }) {
  const products = await getProducts(searchParams);
  return (
    <div>
      <Filters />
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-5 mt-5">
        {products.map((product: ProductInterface) => (
          <div
            key={product._id}
            className="px-4 py-2 flex flex-col gap-1 border border-solid border-gray-300"
          >
            <Link href={`/products/${product._id}`}>
              <div className="text-center">
                <Image
                  src={product.images[0]}
                  alt=""
                  height={150}
                  width={150}
                />
              </div>
              <div className="flex flex-col mt-5">
                <span className="text-sm">{product.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <Rate
                  disabled
                  defaultValue={product.rating || 0}
                  style={{
                    color: "#26577C",
                  }}
                  allowHalf
                />
                <span className="text-gray-500 text-xs">
                  {product.countInStock > 0
                    ? `${product.countInStock} in stock`
                    : "Out of stock"}
                </span>
              </div>
            </Link>

            <div className="flex gap-5 items-center justify-between">
              <h1 className="text-xl font-semibold">$ {product.price}</h1>
              <AddToCartBtn product={product} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
