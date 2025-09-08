"use client";
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Navbar from '../../components/navBar/page';
import Footer from '../../components/footer/page';
import Image from 'next/image';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { removeFromWishlist } from '../../slices/wishlistSlice';
import { toast, Toaster } from 'sonner';
import { AiFillStar, AiOutlineStar, AiTwotoneStar } from 'react-icons/ai';

export default function WishlistPage() {
  const wishlist = useSelector((state) => state.wishlistState.items);
  const dispatch = useDispatch();

  const handleRemove = (id) => {
    dispatch(removeFromWishlist(id));
    toast.success('Removed from wishlist');
  };

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-10 min-h-[60vh]">
        <h1 className="text-3xl font-bold text-center mb-10 text-purple-700">My Wishlist</h1>

        {wishlist.length === 0 ? (
          <div className="text-center text-gray-500 py-20 text-lg">Your wishlist is currently empty.</div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-4">
            {wishlist.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition duration-300 border flex flex-col overflow-hidden"
              >
                <Image
                  src={product.image || '/mug.jpg'}
                  alt={product.name}
                  width={500}
                  height={300}
                  className="w-full h-52 object-cover"
                />
                <div className="p-4 flex flex-col justify-between flex-grow">
                  <div className="mb-4">
                    <h2 className="font-semibold text-lg text-gray-800">{product.name}</h2>
                    <p className="text-purple-600 font-bold mt-1">US ${product.price}</p>
                    <div className="flex text-yellow-400 text-xs sm:text-sm mt-1">
                      <div className="flex text-yellow-400 text-xs sm:text-sm mt-1">
                        {Array.from({ length: 5 }, (_, i) => {
                          const fullStars = Math.floor(product.rating || 0);
                          const hasHalfStar = (product.rating || 0) - fullStars >= 0.5;
                          if (i < fullStars) {
                            return <AiFillStar key={i} />;
                          } else if (i === fullStars && hasHalfStar) {
                            return <AiTwotoneStar key={i} />;
                          } else {
                            return <AiOutlineStar key={i} />;
                          }
                        })}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemove(product._id)}
                    className="mt-auto flex items-center justify-center gap-2 bg-red-100 hover:bg-red-200 text-red-600 font-medium py-2 px-4 rounded-lg transition"
                  >
                    <RiDeleteBin6Line className="text-xl" />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
      <Toaster position="top-center" richColors closeButton />
    </>
  );
}
