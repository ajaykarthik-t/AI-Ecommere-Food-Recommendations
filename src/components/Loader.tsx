'use client'
import React from "react";

function Loader() {
  return (
    <div className="bg-black bg-opacity-75 h-screen w-full fixed inset-0 flex justify-center items-center z-50">
      <div className="h-8 w-8 border-4 border-solid border-white border-t-black animate-spin rounded-full"></div>
    </div>
  );
}

export default Loader;
