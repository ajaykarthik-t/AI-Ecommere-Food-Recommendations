/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect } from "react";
import axios from "axios";
import { message } from "antd";
import { useRouter, useSearchParams } from "next/navigation";

function Filters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = React.useState<string>("");
  const [categories, setCategories] = React.useState([]);
  const [selectedCategory, setSelectedCategory] = React.useState<string>("");

  const getCategories = async () => {
    try {
      const response = await axios.get("/api/categories");
      const tempCategories: any = [
        {
          name: "All",
          _id: "",
        },
      ];
      tempCategories.push(...response.data.data);
      console.log(tempCategories);
      setCategories(tempCategories);
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const onSelectCategory = (category: any) => {
    setSelectedCategory(category._id);

    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("category", category._id);
    router.push(`/?${newSearchParams.toString()}`);
  };

  React.useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    // update the search params for every 500ms
    const timer = setTimeout(() => {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set("search", search);
      router.push(`/?${newSearchParams.toString()}`);
    }, 500);
  }, [search]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-10 bg-gray-300 py-2 px-5">
        {categories.map((category: any) => (
          <div
            key={category._id}
            onClick={() => onSelectCategory(category)}
            className={`cursor-pointer   ${
              selectedCategory === category._id
                ? "text-black font-semibold"
                : "text-gray-500"
            }`}
          >
            <span>{category.name}</span>
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Search products"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}

export default Filters;
