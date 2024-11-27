"use client";
import { getAntdFieldRequiredRule } from "@/helpers/validations"; // Assumes a helper function exists for common validation
import { Button, Form, Input, message } from "antd";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

// Define user type for login
interface userType {
  email: string;
  password: string;
}

function Login() {
  const [loading, setLoading] = React.useState(false); // Loading state for form submission
  const router = useRouter();

  const onLogin = async (values: userType) => {
    try {
      setLoading(true);

      // Ensure environment variable is properly set
      const apiUrl = process.env.NEXT_PUBLIC_DOMAIN
        ? `${process.env.NEXT_PUBLIC_DOMAIN}/api/auth/login`
        : "/api/auth/login";

      await axios.post(apiUrl, values);
      message.success("Login successful");

      // Redirect to home page after successful login
      await router.push("/");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred.";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
      {/* Left side branding section */}
      <div className="h-full bg-primary hidden md:flex items-center justify-center">
        <h1 className="text-7xl font-bold text-red-500">Green</h1>
        <h1 className="text-7xl font-bold text-gray-500">-</h1>
        <h1 className="text-7xl font-bold text-yellow-500">Kart</h1>
      </div>

      {/* Right side login form */}
      <div className="flex items-center justify-center h-full">
        <Form
          className="w-[400px] flex flex-col gap-5"
          layout="vertical"
          onFinish={onLogin}
        >
          <h1 className="text-2xl font-bold">Login</h1>
          <hr />
          {/* Email field */}
          <Form.Item
            name="email"
            label="Email"
            rules={getAntdFieldRequiredRule("Please input your email!")}
          >
            <Input type="email" placeholder="Enter your email" />
          </Form.Item>

          {/* Password field */}
          <Form.Item
            name="password"
            label="Password"
            rules={getAntdFieldRequiredRule("Please input your password!")}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          {/* Submit button */}
          <Button type="primary" htmlType="submit" block loading={loading}>
            Login
          </Button>

          {/* Redirect to register page */}
          <Link href="/auth/register" className="text-primary">
            Don’t have an account? Register
          </Link>
        </Form>
      </div>
    </div>
  );
}

export default Login;
