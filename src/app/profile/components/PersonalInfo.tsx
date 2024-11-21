import React from "react";
import { Form, Button, message } from "antd";
import { getAntdFieldRequiredRule } from "@/helpers/validations";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { SetCurrentUser } from "@/redux/userSlice";

function PersonalInfo() {
  const [loading, setLoading] = React.useState(false);
  const { currentUser } = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const onSave = async (values: any) => {
    try {
      setLoading(true);
      const endPoint = `/api/users/${currentUser._id}`;
      const response = await axios.put(endPoint, values);
      dispatch(SetCurrentUser(response.data));
      message.success("User updated successfully");
    } catch (error: any) {
      message.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <Form
        className="w-[400px] flex flex-col gap-5"
        layout="vertical"
        onFinish={onSave}
        initialValues={{
          name: currentUser.name,
          email: currentUser.email,
        }}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={getAntdFieldRequiredRule("Please input your name!")}
        >
          <input type="text" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={getAntdFieldRequiredRule("Please input your email!")}
        >
          <input type="email" disabled />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={getAntdFieldRequiredRule("Please input your old password!")}
        >
          <input type="password" />
        </Form.Item>

        <Form.Item
          name="newPassword"
          label="New Password"
          rules={getAntdFieldRequiredRule("Please input your new password!")}
        >
          <input type="password" />
        </Form.Item>

        <Button type="primary" htmlType="submit" block loading={loading}>
          Save
        </Button>
      </Form>
    </div>
  );
}

export default PersonalInfo;
