import { connectDB } from "@/configs/dbConfig";
import { validateJWT } from "@/helpers/validateJWT";
import { NextRequest, NextResponse } from "next/server";
import Order from "@/models/orderModel";

connectDB();

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: {
      orderid: string;
    };
  }
) {
  try {
    await validateJWT(request);
    const order = await Order.findById(params.orderid).populate(
      "user",
      "name email"
    );
    return NextResponse.json(order);
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message,
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  {
    params,
  }: {
    params: {
      orderid: string;
    };
  }
) {
  try {
    await validateJWT(request);
    const reqBody = await request.json();
    await Order.findByIdAndUpdate(params.orderid, reqBody);
    return NextResponse.json({
      message: "Order updated successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message,
      },
      { status: 500 }
    );
  }
}
