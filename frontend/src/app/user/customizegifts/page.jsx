"use client";

import Footer from "../../components/footer/page";
import Navbar from "../../components/navBar/page";
import { FaRegEdit } from "react-icons/fa";
import { useState } from "react";
import Image from "next/image";

export default function CustomizeGifts() {
  const [name, setName] = useState("");
  const [address, setAddress] =useState("");

  const productList = Array.from({ length: 10 });

  return (
    <>
      <div className="px-20 flex-col items-center">
        <Navbar />

        <div className="w-full flex justify-center items-center border border-purple-600 p-2 rounded text-purple-600 font-bold gap-2 my-3">
          <FaRegEdit />
          <span>Gift Customization</span>
        </div>

        <div className="flex w-full gap-15">
         
          <div className="w-[55%]flex flex-col items-center">
            <Image
               src="/customize.jpg"
               alt="Customized Mug"
               width={600}
               height={600}
               className="rounded-md mx-auto"
            />
            <h2 className="text-xl font-bold mt-4 text-center">Birthday Mug – White</h2>
            <p className="text-sm text-yellow-500 text-center">★★★★☆ (27 ratings)</p>
            <p className="mt-2 text-gray-600 text-sm text-center max-w-2xl pl-[25px] pr-[25px]">
               There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomized words which don't look even slightly believable...
            </p>
         </div>

          {/* Customization Options */}
          <div className="w-[45%] border rounded-xl p-5 shadow-md bg-white ">
            <h3 className="font-bold text-lg  mt-4 mb-4">Customization options</h3>
            <form className="flex flex-col gap-4">
              <div>
                <label className="text-sm">Name</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded p-1 mt-1"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm">Choose the label</label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {[...Array(7)].map((_, i) => (
                    <div
                      key={i}
                      className="w-full h-16 rounded-md border hover:border-purple-600 cursor-pointer overflow-hidden"
                    >
                      <Image
                        src={`/labels/label${i + 1}.jpg`}
                        alt={`Label ${i + 1}`}
                        width={150}
                        height={250}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm">Available Color</label>
                <select className="w-full border border-gray-300 rounded p-1 mt-1">
                  <option>Choose color</option>
                  <option>White</option>
                  <option>Black</option>
                  <option>Pink</option>
                </select>
              </div>

              <button
                type="submit"
                className="bg-[#822BE2] text-white rounded p-2 mt-3 border-2 hover:bg-purple-300 hover:border-purple-900  hover:text-purple-900"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>

        {/* Payment & Checkout Section */}
        <div className="mt-10 flex justify-between gap-4 pl-[25px] pr-[25px]">
          {/* Payer Info */}
          <div className="w-1/3 border rounded p-4 bg-white shadow">
            <h4 className="font-semibold mb-2">Payer Information</h4>
            <div className="flex mt-4">
                <p className="flex flex-col w-1/2">
                  <span className="text-[14px]">Payer name:</span>
                  <span className="font-bold">Saru Saralan</span> 
               </p>
                <p className="flex flex-col w-1/2">
                 <span className="text-[14px]">Mobile Number:</span>
                 <span className="font-bold">0778390211</span> 
               </p>
            </div>
            
            <p className="mt-4">
              <span className="text-[14px]">Shipping Address:</span>
            </p>
            <input
              className="w-full border border-gray-300 rounded p-1 mt-1 bg-gray-100"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <div className="flex gap-2 mt-2">
              <button className="px-3 py-1 border-2  rounded  hover:bg-gray-200 hover:border-[#822BE2] hover:text-[#822BE2]">
                Cancel
              </button>
              <button className="px-3 py-1 bg-[#822BE2] text-white rounded border-2 hover:bg-purple-300 hover:border-purple-900  hover:text-purple-900">
                Save changes
              </button>
            </div>
          </div>

          {/* Payment Info */}
          <div className="w-1/3 border rounded p-4 bg-white shadow">
            <h4 className="font-semibold mb-2">Payment Information</h4>
            <p>
              Shipping fee will be added based on your buying product and will
              be delivered within 7 days
            </p>
            <p className="text-sm mt-1 text-blue-600 underline cursor-pointer">
              Returnable with Terms & Conditions
            </p>
            <h5 className="font-semibold mt-3">Payment Options</h5>
            <div className="flex gap-4 mt-2">
              <img src="/paypal.png" className="w-10" alt="PayPal" />
              <img src="/visa.png" className="w-10" alt="Visa" />
            </div>
          </div>

          {/* Checkout Summary */}
          <div className="w-1/3 border rounded p-4 bg-white shadow">
            <h4 className="font-semibold mb-2">Check out</h4>
            <p className="pb-2 pt-2">
              Total items: <strong>4</strong>
            </p>
            <p className="pb-2">
              Shipping fees: <strong>US 15$</strong>
            </p>
            <p className="pb-2">
              Sub Total: <strong>US 55.00$</strong>
            </p>
            <p className="pb-2">
              Estimate Total: <strong>US 50.75$</strong>
            </p>
            <button className="mt-3 w-full bg-[#822BE2] text-white py-2 rounded border-2 hover:bg-purple-300 hover:border-purple-900  hover:text-purple-900">
              Check Out US 50.75$
            </button>
          </div>
        </div>

         <div className="px-20 py-10 w-full pl-[25px] pr-[25px]">
            <h2 className="text-lg font-semibold mb-6">Recommended Products for you</h2>
      
            <div className="grid grid-cols-5 gap-6">
            {productList.map((_, index) => (
               <div key={index} className="flex flex-col items-start">
                  <div className="w-full aspect-square bg-gray-200 rounded-md"></div>

                  <p className="text-sm font-medium mt-2">Birthday Balloons</p>
                  <p className="text-sm font-bold">US 18.50$</p>
                  
                  <div className="flex items-center text-sm mt-1 text-gray-700">
                  <span className="text-black mr-1">★★★★☆</span>
                  (27 ratings)
                  </div>
               </div>
            ))}
            </div>

            <p className="text-center mt-6 text-sm font-medium text-gray-700 hover:underline cursor-pointer">
            Shop more
            </p>
         </div>

        <Footer />
      </div>
    </>
  );
}
