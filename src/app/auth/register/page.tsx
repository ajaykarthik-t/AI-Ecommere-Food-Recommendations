"use client";
import { getAntdFieldRequiredRule } from "@/helpers/validations";
import { Button, Form, Input, message } from "antd";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

interface userType {
  name: string;
  email: string;
  password: string;
}

function Register() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const onRegister = async (values: userType) => {
    try {
      setLoading(true);
      
      // Use relative path for API calls (recommended for Next.js)
      const apiUrl = "/api/auth/register";
      
      console.log("Attempting to register with URL:", apiUrl);
      console.log("Registration data:", { name: values.name, email: values.email });

      const response = await axios.post(apiUrl, values);
      
      console.log("Registration response:", response.data);
      message.success("Registration successful, please login to continue");
      await router.push("/auth/login");
    } catch (error: any) {
      console.error("Registration error:", error);
      
      // Better error handling
      if (error.response) {
        // Server responded with error status
        const errorMessage = error.response?.data?.message || `Server error: ${error.response.status}`;
        console.error("Server error:", error.response.status, error.response.data);
        message.error(errorMessage);
      } else if (error.request) {
        // Request was made but no response received
        console.error("Network error:", error.request);
        message.error("Network error: Unable to reach the server");
      } else {
        // Something else happened
        console.error("Request setup error:", error.message);
        message.error(`Request error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
      <div className="h-full bg-primary hidden md:flex items-center justify-center">
        <h1 className="text-7xl font-bold text-red-500">Green</h1>
        <h1 className="text-7xl font-bold text-gray-500">-</h1>
        <h1 className="text-7xl font-bold text-yellow-500">Kart</h1>
      </div>

      <div className="flex items-center justify-center h-full">
        <Form
          className="w-[400px] flex flex-col gap-5"
          layout="vertical"
          onFinish={onRegister}
        >
          <h1 className="text-2xl font-bold">Register</h1>
          <hr />
          <Form.Item
            name="name"
            label="Name"
            rules={getAntdFieldRequiredRule("Please input your name!")}
          >
            <Input placeholder="Enter your name" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={getAntdFieldRequiredRule("Please input your email!")}
          >
            <Input type="email" placeholder="Enter your email" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={getAntdFieldRequiredRule("Please input your password!")}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Register
          </Button>
          <Link href="/auth/login" className="text-primary">
            Already have an account? Login
          </Link>
        </Form>
      </div>
    </div>
  );
}

export default Register;