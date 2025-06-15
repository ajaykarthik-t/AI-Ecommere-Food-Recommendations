// File: src/app/page.tsx (REPLACE THE EXISTING FILE WITH THIS)
import AddToCartBtn from "@/components/AddToCartBtn";
import WishlistButton from "@/components/WishlistButton";
import Filters from "@/components/Filters";
import { ProductInterface } from "@/interfaces";
import { Rate } from "antd";
import axios from "axios";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";

async function getProducts(searchParams: any) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    const category = searchParams.category || "";
    const search = searchParams.search || "";
    const endPoint = `${process.env.NEXT_PUBLIC_DOMAIN}/api/products?category=${category}&search=${search}`;
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
            className="px-4 py-2 flex flex-col gap-1 border border-solid border-gray-300 relative group hover:shadow-md transition-shadow"
          >
            {/* Wishlist Button - Positioned in top right */}
            <div className="absolute top-2 right-2 z-10">
              <WishlistButton product={product} />
            </div>

            <Link href={`/products/${product._id}`}>
              <div className="text-center">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  height={150}
                  width={150}
                  className="mx-auto object-cover"
                />
              </div>
              <div className="flex flex-col mt-5">
                <span className="text-sm font-medium line-clamp-2 hover:text-blue-600 transition-colors">
                  {product.name}
                </span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <Rate
                  disabled
                  defaultValue={product.rating || 0}
                  style={{
                    color: "#26577C",
                  }}
                  allowHalf
                  className="text-xs"
                />
                <span className="text-gray-500 text-xs">
                  {product.countInStock > 0
                    ? `${product.countInStock} in stock`
                    : "Out of stock"}
                </span>
              </div>
            </Link>

            <div className="flex gap-5 items-center justify-between mt-3">
              <h1 className="text-xl font-semibold text-green-600">${product.price}</h1>
              <AddToCartBtn product={product} />
            </div>
          </div>
        ))}
      </div>

      {/* Show message if no products found */}
      {products.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="text-center">
            <i className="ri-shopping-bag-line text-6xl text-gray-400 mb-4"></i>
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              No products found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        </div>
      )}
    </div>
  );
}