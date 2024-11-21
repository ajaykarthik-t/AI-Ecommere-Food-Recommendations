/* eslint-disable @next/next/no-img-element */
import { getAntdFieldRequiredRule } from "@/helpers/validations";
import { Button, Form, message, Upload } from "antd";
import axios from "axios";
import React from "react";
import { useRouter } from "next/navigation";

function ProductForm({
  setSelectedFiles,
  loading,
  initialValues,
  onSave,
  existingImages = [],
  setExistingImages,
}: ProductFormProps) {
  const router = useRouter();
  const [categories, setCategories] = React.useState([]);

  const getCategories = async () => {
    try {
      const response = await axios.get("/api/categories");
      setCategories(response.data.data);
    } catch (error: any) {
      message.error(error.message);
    }
  };

  React.useEffect(() => {
    getCategories();
  }, []);
  return (
    <div>
      <Form
        layout="vertical"
        className="mt-10 flex flex-col xl:grid grid-cols-3 gap-5"
        onFinish={onSave}
        initialValues={initialValues}
      >
        <div className="col-span-3">
          <Form.Item
            label="Name"
            name="name"
            rules={getAntdFieldRequiredRule("Name is required")}
          >
            <input />
          </Form.Item>
        </div>
        <div className="col-span-3">
          <Form.Item
            label="Description"
            name="description"
            rules={getAntdFieldRequiredRule("Description is required")}
          >
            <textarea />
          </Form.Item>
        </div>

        <Form.Item
          label="Price"
          name="price"
          rules={getAntdFieldRequiredRule("Price is required")}
        >
          <input type="number" />
        </Form.Item>

        <Form.Item
          label="Category"
          name="category"
          rules={getAntdFieldRequiredRule("Category is required")}
        >
          <select>
            <option value="">Select Category</option>
            {categories.map((category: any) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </Form.Item>

        <Form.Item
          label="Count In Stock"
          name="countInStock"
          rules={getAntdFieldRequiredRule("Stock is required")}
        >
          <input type="number" />
        </Form.Item>

        <div className="col-span-3 flex gap-5">
          {existingImages.map((image: any) => (
            <div
              key={image}
              className="border border-solid p-3 border-gray-300"
            >
              <img src={image} alt="product" className="w-20 h-20" />
              <h1
                className=" cursor-pointer underline text-sm"
                onClick={() => {
                  setExistingImages((prev: any) =>
                    prev.filter((i: any) => i !== image)
                  );
                }}
              >
                Remove
              </h1>
            </div>
          ))}
        </div>

        <div className="col-span-3">
          <Upload
            listType="picture-card"
            multiple
            beforeUpload={(file) => {
              setSelectedFiles((prev: any) => [...prev, file]);
              return false;
            }}
          >
            Upload
          </Upload>
        </div>

        <div className="col-span-3 mt-10">
          <h1 className="text-lg font-semibold">Features</h1>
          <Form.List name="features">
            {(fields, { add, remove }) => (
              <div className="flex flex-col gap-3">
                {fields.map((field, index) => (
                  <div key={field.key} className="flex gap-5 items-end">
                    <Form.Item
                      label={`Feature ${index + 1}`}
                      name={[field.name]}
                      className="w-full"
                    >
                      <input />
                    </Form.Item>
                    <Button onClick={() => remove(field.name)}>Remove</Button>
                  </div>
                ))}

                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  className="mt-5"
                >
                  Add Feature
                </Button>
              </div>
            )}
          </Form.List>
        </div>

        <div className="col-span-3 justify-end flex gap-5">
          <Button onClick={() => router.back()}>Back</Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Save
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default ProductForm;

interface ProductFormProps {
  setSelectedFiles: any;
  loading: boolean;
  onSave: any;
  initialValues?: any;
  existingImages?: any;
  setExistingImages?: any;
}
