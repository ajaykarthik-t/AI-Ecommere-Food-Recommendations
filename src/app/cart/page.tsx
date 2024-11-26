"use client";
import {
  CartState,
  EditProductInCart,
  RemoveProductFromCart,
} from "@/redux/cartSlice";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, Card } from "antd";
import axios from "axios";
import CheckoutModal from "./CheckoutModal";

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY; 


function Cart() {
  // Modal and State Management
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [recommendations, setRecommendations] = useState<Array<{ name: string; recipe: string }>>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<{ name: string; recipe: string } | null>(null);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [isRecommendationLoading, setIsRecommendationLoading] = useState(false);

  // Redux Cart Management
  const { cartItems }: CartState = useSelector((state: any) => state.cart);
  const subTotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const total = subTotal + 50;
  const dispatch = useDispatch();

  // Handle Recipe Modal
  const handleRecipeClick = (dish: { name: string; recipe: string }) => {
    setSelectedRecipe(dish);
    setShowRecipeModal(true);
  };

  const fetchRecipeRecommendations = async () => {
    setIsRecommendationLoading(true);
  
    try {
      // Create the content from the cart items
      const itemNames = cartItems
        .map((item) => item.name) // Get the names of the items
        .filter((name) => name);  // Filter out any undefined or null names
  
      const content = {
        contents: [
          {
            parts: [
              {
                text: `Give me 10 recipe headings and their instructions in a paragraph form based on the following ingredients: ${itemNames.join(", ")}. Each recipe should have a heading and the instructions in a single paragraph format.`
              },
            ],
          },
        ],
      };
  
      const response = await axios.post(
        `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
        content,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      const recipeText = response.data?.candidates[0]?.content?.parts[0]?.text || "";
      const recipeLines = recipeText.split("\n\n").filter((line: string) => line.trim() !== ""); // Specify 'string' type for 'line'
      
      const parsedRecommendations = recipeLines.map((recipe: string, index: number) => { // Specify 'string' for recipe and 'number' for index
        const [nameMatch] = recipe.match(/^\*\*(\d+\.\s*[^*]+)\*\*/) || [];
        const name = nameMatch ? nameMatch.replace(/\*\*/g, '').trim() : `Recipe ${index + 1}`;
        const recipeInstructions = recipe.replace(/^\*\*[^*]+\*\*\s*/, '').trim();
        
        return {
          name,
          recipe: recipeInstructions
        };
      });
      

      setRecommendations(parsedRecommendations);
    } catch (error) {
      console.error('Error fetching recipe recommendations:', error);
      setRecommendations([{ name: "Error", recipe: "Sorry, we couldn't fetch recommendations. Please try again later." }]);
    } finally {
      setIsRecommendationLoading(false);
    }
  };

  return (
    <div className="mt-10">
      {cartItems.length > 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-3 text-gray-700 gap-10">
          {/* Left Section: Cart Items */}
          <div className="col-span-2 flex flex-col gap-5">
            <span className="text-2xl font-semibold">My Cart</span>
            {cartItems.map((item) => (
              <div
                className="grid grid-cols-4 xl:grid-cols-7 items-center xl:gap-10 gap-2"
                key={item._id}
              >
                {/* Cart Item Details */}
                <div className="col-span-4 flex gap-2 items-center">
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    height={80}
                    width={80}
                    className="border p-2 border-gray-300 border-solid hidden xl:block"
                  />
                  <div className="flex flex-col gap-2">
                    <span className="text-sm">{item.name}</span>
                    <span
                      className="text-xs underline text-red-700 cursor-pointer"
                      onClick={() => dispatch(RemoveProductFromCart(item))}
                    >
                      Remove
                    </span>
                  </div>
                </div>
                <span className="col-span-1">$ {item.price}</span>

                {/* Quantity Control */}
                <div className="col-span-1 border border-solid p-2 border-gray-400 flex gap-2 justify-between">
                  <i
                    className="ri-subtract-line cursor-pointer"
                    onClick={() => {
                      if (item.quantity !== 1) {
                        dispatch(
                          EditProductInCart({
                            ...item,
                            quantity: item.quantity - 1,
                          })
                        );
                      } else {
                        dispatch(RemoveProductFromCart(item));
                      }
                    }}
                  ></i>
                  <span>{item.quantity}</span>
                  <i
                    className="ri-add-line cursor-pointer"
                    onClick={() => {
                      dispatch(
                        EditProductInCart({
                          ...item,
                          quantity: item.quantity + 1,
                        })
                      );
                    }}
                  ></i>
                </div>
                <span className="col-span-1">
                  $ {item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>

          {/* Right Section: Amount Summary */}
          <div className="col-span-1 border border-gray-400 border-solid p-5">
            <h1 className="text-xl font-semibold">Amount Summary</h1>
            <div className="flex flex-col gap-2 mt-5">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subTotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span>$ 50</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>$ {total}</span>
              </div>

              {/* Checkout Button */}
              <Button
                block
                type="primary"
                className="mt-5"
                onClick={() => setShowCheckoutModal(true)}
              >
                Proceed to Checkout
              </Button>

              {/* Recipe Recommendations Button */}
              <Button
                block
                type="default"
                className="mt-3"
                loading={isRecommendationLoading}
                onClick={fetchRecipeRecommendations}
              >
                Get Recipe Recommendations
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-5 text-gray-700">
          <i className="ri-shopping-cart-line text-6xl"></i>
          <h1 className="text-sm">Your cart is empty</h1>
        </div>
      )}

      {/* Recommendations Section */}
      {recommendations.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Recipe Recommendations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {recommendations.map((dish, index) => (
              <Card 
                key={index} 
                hoverable 
                className="transform transition-all duration-300 hover:scale-105"
                onClick={() => handleRecipeClick(dish)}
              >
                <Card.Meta 
                  title={
                    <div className="text-lg font-semibold text-gray-800 truncate">
                      {dish.name}
                    </div>
                  }
                  description={
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {dish.recipe.length > 100 
                        ? `${dish.recipe.slice(0, 100)}...` 
                        : dish.recipe}
                    </p>
                  }
                />
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Recipe Modal */}
      <Modal
  title={selectedRecipe?.name || "Recipe Details"}
  visible={showRecipeModal}
  onCancel={() => setShowRecipeModal(false)}
  footer={[
    <Button key="close" onClick={() => setShowRecipeModal(false)}>Close</Button>,
  ]}
  closable={false} 
  width={600}
>
  {selectedRecipe && (
    <div className="whitespace-pre-line text-base leading-relaxed text-gray-700">
      {selectedRecipe.recipe}
    </div>
  )}
</Modal>


      {/* Checkout Modal */}
      {showCheckoutModal && (
        <CheckoutModal
          setShowCheckoutModal={setShowCheckoutModal}
          showCheckoutModal={showCheckoutModal}
          total={total}
        />
      )}
    </div>
  );
}

export default Cart;