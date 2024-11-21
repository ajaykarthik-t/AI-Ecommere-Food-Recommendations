"use client";
import { Table, message } from "antd";
import React from "react";
import axios from "axios";
import Loader from "@/components/Loader";
import moment from "moment";

function OderInfo({ params }: { params: any }) {
  const [loading = false, setLoading] = React.useState<boolean>(false);
  const [order, setOrder] = React.useState<any>(null);

  const getOrder = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/orders/${params.orderid}`);
      setOrder(response.data);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    getOrder();
  }, []);

  const itemsColumns = [
    {
      title: "Product",
      dataIndex: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
    },
    {
      title: "Total",
      dataIndex: "total",
      render: (total: number, record: any) =>
        `$ ${record.price * record.quantity}`,
    },
  ];

  const getProperty = (key: string, value: any) => {
    return (
      <div className="flex flex-col">
        <span className="text-gray-500 text-sm">{key}</span>
        <span className="text-gray-700">
          <b>{value}</b>
        </span>
      </div>
    );
  };

  return (
    <div>
      {loading && <Loader />}
      {order && (
        <div>
          <h1 className="text-sm xl:text-2xl font-bold text-gray-700">
            View Order : #{order._id}
          </h1>
          <hr className="border-gray-300 border-solid" />

          <div className="flex flex-col xl:grid grid-cols-3 gap-5 mt-8 w-full">
            <h1 className="text-xl col-span-3">Basic Information</h1>

            {getProperty("Order ID", order._id)}
            {getProperty(
              "Placed On",
              moment(order.createdAt).format("DD MMM YYYY hh:mm a")
            )}
            {getProperty("Total Amount", `$ ${order.total}`)} 
            {getProperty("Order Status", order.orderStatus)}
            {getProperty("Payment Status", order.paymentStatus)}
            {getProperty("Transaction Id", order.transactionId)}

            <hr className="border-gray-300 border-dashed col-span-3" />

            <h1 className="text-xl col-span-3">Shipping Information</h1>

            {Object.keys(order.shippingAddress.address).map((key) => {
              return getProperty(key, order.shippingAddress.address[key]);
            })}

            <hr className="border-gray-300 border-dashed col-span-3" />
          </div>

          <h1 className="text-xl col-span-3 mt-8">Items</h1>

          <Table
            columns={itemsColumns}
            dataSource={order.items}
            pagination={false}
            rowKey="_id"
          />
        </div>
      )}
    </div>
  );
}

export default OderInfo;
