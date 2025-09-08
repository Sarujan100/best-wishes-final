// frontend/src/app/contribution/[id]/page.jsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';

const ContributionDetailsPage = () => {
  const { id } = useParams();
  const [contribution, setContribution] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  useEffect(() => {
    const fetchContribution = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/gift/${id}`);
        setContribution(res.data);
      } catch (err) {
        setError('Failed to load contribution details.');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchContribution();
  }, [id]);

  const handlePurchase = async () => {
    if (!contribution) return;
    setPurchaseLoading(true);
    setPurchaseSuccess(false);
    try {
      // You may want to collect the participant's email here, or use authentication
      // For demo, we'll just mark the first unpaid participant as paid
      const unpaid = contribution.participants.find(p => !p.hasPaid && !p.declined);
      if (!unpaid) {
        setError('All participants have already paid or declined.');
        setPurchaseLoading(false);
        return;
      }
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/gift/${contribution._id}/paid`, { email: unpaid.email });
      setPurchaseSuccess(true);
      // Refetch details
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/gift/${id}`);
      setContribution(res.data);
    } catch (err) {
      setError('Failed to mark as paid.');
    } finally {
      setPurchaseLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading contribution details...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!contribution) return <div className="p-8 text-center">Contribution not found.</div>;

  // Extract sender info and product details
  const { productName, productPrice, share, participants, deadline, product, createdBy } = contribution;
  const senderName = createdBy?.firstName || createdBy?.name || createdBy?.email?.split('@')[0] || 'A friend';
  const senderEmail = createdBy?.email || '';
  const productImage = product?.images && product.images.length > 0 ? (product.images[0].url || product.images[0]) : null;
  const productDesc = product?.shortDescription || product?.detailedDescription || '';
  const productPriceDisplay = product?.salePrice > 0 ? product.salePrice : product?.retailPrice || productPrice;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="w-full bg-white shadow-sm py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Best Wishes Logo" className="h-8 w-auto rounded-full" />
          {/* <span className="text-xl font-bold text-purple-700">Best Wishes</span> */}
        </div>
        <span className="text-gray-500 text-sm">Collaborative Gifting</span>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8 mt-8">
          <h1 className="text-2xl font-bold text-purple-700 mb-2 text-center">🎁 Gift Contribution Invitation</h1><hr></hr>
          <p className="text-center text-gray-600 mb-6 mt-[20px]">You have been invited by <span className="font-semibold text-purple-700">{senderName}</span>{senderEmail && ` (${senderEmail})`} to contribute to a special gift!</p>

          <div className="flex flex-col md:flex-row gap-6 items-center mb-6">
            {productImage ? (
              <img src={productImage} alt={productName} className="w-44 h-44 object-cover rounded-lg border" />
            ) : (
              <div className="w-44 h-44 bg-gray-100 flex items-center justify-center rounded-lg border text-gray-400">No Image</div>
            )}
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-2">{productName}</h2>
              <p className="mb-1 text-gray-700">{productDesc}</p>
              <p className="mb-1">Total Price: <span className="font-medium">Rs. {productPriceDisplay}</span></p>
              <p className="mb-1">Your Share: <span className="font-medium">Rs. {share}</span></p>
              <p className="mb-1">Deadline: <span className="font-medium">{new Date(deadline).toLocaleDateString()}</span></p>
              {product?._id && (
                <a
                  href={`/productDetail/${product._id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 px-4 py-2 border border-purple-700 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors text-sm font-medium"
                >
                  View Product
                </a>
              )}
            </div>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold mb-2">Participants</h3>
            <ul className="list-disc pl-6">
              {participants.map((p, idx) => (
                <li key={idx} className="mb-1">
                  {p.email} {p.hasPaid ? <span className="text-green-600">(Paid)</span> : p.declined ? <span className="text-red-500">(Declined)</span> : <span className="text-yellow-600">(Pending)</span>}
                </li>
              ))}
            </ul>
          </div>

          <button
            className="w-full bg-purple-700 text-white px-6 py-3 rounded-lg hover:bg-purple-800 disabled:opacity-50 text-lg font-semibold mt-2"
            onClick={handlePurchase}
            disabled={purchaseLoading || purchaseSuccess || !participants.some(p => !p.hasPaid && !p.declined)}
          >
            {purchaseLoading ? 'Processing...' : purchaseSuccess ? 'Thank you for your contribution!' : `Contribute / Purchase ( Rs.${share} )`}
          </button>
          {purchaseSuccess && <div className="mt-4 text-green-600 text-center">Payment marked as complete. Thank you!</div>}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center text-gray-400 text-sm py-6 mt-8">
        &copy; {new Date().getFullYear()} Best Wishes. All rights reserved.
      </footer>
    </div>
  );
};

export default ContributionDetailsPage; 