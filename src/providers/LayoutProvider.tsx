"use client";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import axios from "axios";
import { Badge, message, Popover } from "antd";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import { SetCurrentUser } from "@/redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { CartState } from "@/redux/cartSlice";

function LayoutProvider({ children }: { children: React.ReactNode }) {
  const { currentUser } = useSelector((state: any) => state.user);
  const { cartItems }: CartState = useSelector((state: any) => state.cart);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isPrivatePage =
    pathname !== "/auth/login" && pathname !== "/auth/register";
  const dispatch = useDispatch();
  const getCurrentUser = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/auth/currentuser");
      dispatch(SetCurrentUser(response.data.data));
    } catch (error: any) {
      message.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (isPrivatePage) {
      getCurrentUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPrivatePage, pathname]);



  useEffect(() => {

       // when the cartItems changes, we will save the cartItems to the localStorage
       localStorage.setItem("cartItems", JSON.stringify(cartItems));

  }, [cartItems]);


  const onLogout = async () => {
    try {
      setLoading(true);
      await axios.get("/api/auth/logout");
      message.success("Logout successfully");
      dispatch(SetCurrentUser(null));
      router.push("/auth/login");
    } catch (error: any) {
      message.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const content = (
    <div className="flex flex-col gap-2 p-2">
      <div
        className="flex gap-2 items-center cursor-pointer text-md"
        onClick={() => router.push("/profile")}
      >
        <i className="ri-shield-user-line"></i>
        <span>Profile</span>
      </div>

      <div
        className="flex gap-2 items-center cursor-pointer text-md"
        onClick={() => onLogout()}
      >
        <i className="ri-logout-box-r-line"></i>
        <span>Logout</span>
      </div>
    </div>
  );

  return (
    <div>
      {loading && <Loader />}
      {isPrivatePage && currentUser && (
        <>
          <div className="bg-primary py-2 px-5 flex justify-between items-center">
            <div
              className="flex gap-2 cursor-pointer"
              onClick={() => router.push("/")}
            >
              <h1 className="text-2xl font-bold text-red-500">Blink</h1>
              <h1 className="text-2xl font-bold text-yellow-500">Shop</h1>
            </div>

            <div className="flex gap-5 items-center">
              <Badge count={cartItems.length} className="cursor-pointer">
                <i
                  className="ri-shopping-cart-line text-white text-2xl"
                  onClick={() => router.push("/cart")}
                ></i>
              </Badge>
              <Popover content={content} trigger="click">
                <div className="flex h-8 w-8 bg-white p-2 rounded-full items-center justify-center cursor-pointer">
                  <span>{currentUser.name[0]}</span>
                </div>
              </Popover>
            </div>
          </div>
          <div className="p-5">{children}</div>
        </>
      )}

      {!isPrivatePage && children}
    </div>
  );
}

export default LayoutProvider;
