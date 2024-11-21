import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { connectDB } from "@/configs/dbConfig";
import bcryptjs from "bcryptjs";
connectDB();

interface Params {
  userid: string;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const userid = params.userid;
    // check if existing password is correct
    const reqBody = await request.json();
    const user = await User.findOne({ email: reqBody.email });
    const isMatch = await bcryptjs.compare(
      reqBody.password,
      user.password as string
    );
    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid old password" },
        { status: 401 }
      );
    }

    // update password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(reqBody.newPassword, salt);
    reqBody.password = hashedPassword;
    const updatedUser = await User.findByIdAndUpdate(userid, reqBody, {
      new: true,
    }).select("-password");
    return NextResponse.json(updatedUser);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
