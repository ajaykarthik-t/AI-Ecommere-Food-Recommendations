"use client";
import React, { useEffect } from "react";
import ProductForm from "../components/ProductForm";
import axios from "axios";
import { message } from "antd";
import { useRouter } from "next/navigation";
import { uploadImagesAndReturnUrls } from "@/helpers/imageHandling";

function AddProduct() {
  const [selectedFiles = [], setSelectedFiles] = React.useState([]);
  const [loading = false, setLoading] = React.useState<boolean>(false);
  const router = useRouter();
  const onSave = async (values: any) => {
    try {
      setLoading(true);
      const imagesUrls = await uploadImagesAndReturnUrls(selectedFiles);
      values.images = imagesUrls;
      await axios.post("/api/products", values);
      message.success("Product created successfully");
      router.push("/profile?id=1");
    } catch (error: any) {
      message.error(error.message || error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(selectedFiles);
  }, [selectedFiles]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">Add Product</h1>
      <hr />

      <ProductForm
        setSelectedFiles={setSelectedFiles}
        loading={loading}
        onSave={onSave}
      />
    </div>
  );
}

export default AddProduct;
