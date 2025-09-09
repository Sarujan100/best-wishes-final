'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { FaRegTrashAlt } from "react-icons/fa";
import { IoWarningOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import axios from 'axios';
import { toast } from 'sonner';

export default function CollaborativePurchaseModal({ 
  isOpen, 
  onClose, 
  onAccept, 
  productName, 
  productPrice,
  productID,
  quantity
}) {
  const [isChecked, setIsChecked] = useState(false);
  const [emails, setEmails] = useState(['']);
  const [loading, setLoading] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log('CollaborativePurchaseModal props:', {
      isOpen,
      productName,
      productPrice,
      productID,
      quantity
    });
  }, [isOpen, productName, productPrice, productID, quantity]);

  const { user } = useSelector(state => state.userState);
  const selfEmailIncluded = emails.some(email => email.trim().toLowerCase() === user?.email?.toLowerCase());

  const emailCounts = emails.reduce((acc, email) => {
    const e = email.trim().toLowerCase();
    if (e) acc[e] = (acc[e] || 0) + 1;
    return acc;
  }, {});
  const hasDuplicateEmails = Object.values(emailCounts).some(count => count > 1);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleEmailChange = (index, value) => {
    const updated = [...emails];
    updated[index] = value;
    setEmails(updated);
  };

  const addEmailField = () => {
    if (emails.length < 3) setEmails([...emails, '']);
  };

  const removeEmailField = (index) => {
    const updated = [...emails];
    updated.splice(index, 1);
    setEmails(updated);
  };

  const handleAccept = async () => {
    if (
      isChecked && 
      !selfEmailIncluded && 
      emails.every(email => email.trim() !== '') &&
      !hasDuplicateEmails
    ) {
      setLoading(true);
      try {
        console.log('Creating collaborative purchase with:', {
          productID,
          quantity,
          participants: emails.map(e => e.trim()).filter(e => e)
        });

        if (!productID) {
          toast.error('Product ID is missing. Please try again.');
          setLoading(false);
          return;
        }

        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/collaborative-purchases`, {
          productID,
          quantity,
          participants: emails.map(e => e.trim()).filter(e => e)
        }, {
          withCredentials: true
        });

        onAccept(emails);
        setIsChecked(false);
        setEmails(['']);

        toast.success(res.data.message || 'Collaborative purchase created successfully');
        
      } catch (err) {
        console.error('Error creating collaborative purchase:', err.response?.data);
        toast.error(err.response?.data?.message || 'Failed to create collaborative purchase');
      } finally {
        setLoading(false);
      }
    }
  };

  const participantsCount = 1 + emails.length;
  const shareAmount = (productPrice / participantsCount).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-xl p-6 rounded-2xl shadow-xl relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-black">
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-purple-700 mb-4">🛒 Collaborative Purchase</h2>

        <div className="mb-6 text-gray-700 border border-purple-500 rounded p-4 space-y-1">
          <p><strong>Product:</strong> <span className='text-purple-500'>{productName.length > 35 ? productName.slice(0, 35) + '...' : productName}</span></p>
          <p><strong>Quantity:</strong> <span className='text-purple-500'>{quantity}</span></p>
          <p><strong>Total Price:</strong> <span className='text-purple-500'>${productPrice.toFixed(2)}</span></p>
          <p><strong>Participants:</strong> <span className='text-purple-500'>{participantsCount}</span></p>
          <p><strong>Each pays:</strong> <span className='text-purple-500'>${shareAmount}</span></p>
          <p><strong>Product Id:</strong> <span className='text-purple-500'>${productID}</span></p>
        </div>

        <ul className="list-disc list-inside text-gray-700 space-y-2 text-sm mb-6">
          <li>Maximum of 3 participants (excluding yourself).</li>
          <li>Total product price will be divided equally among participants.</li>
          <li>Each invited person will receive a unique payment link via email.</li>
          <li>Purchase will only proceed if all participants complete payment within 3 days.</li>
          <li>If any participant declines or fails to pay within the time, the purchase is cancelled.</li>
          <li>Refunds will be automatically processed for any paid participants if the purchase is cancelled.</li>
          <li>You can track the progress in your dashboard and cancel manually if needed.</li>
        </ul>

        <div className="mb-6">
          <label className="block font-medium text-gray-700 mb-2">Invite Collaborators (up to 3):</label>
          {emails.map((email, index) => (
            <div key={index} className="flex items-center gap-2 mb-3">
              <input
                type="email"
                placeholder={`Collaborator ${index + 1} email`}
                value={email}
                onChange={(e) => handleEmailChange(index, e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              {emails.length > 1 && (
                <button onClick={() => removeEmailField(index)} className="text-red-500 hover:text-red-700">
                  <FaRegTrashAlt size={18} />
                </button>
              )}
            </div>
          ))}
          {emails.length < 3 && (
            <button
              onClick={addEmailField}
              className="text-purple-600 hover:underline text-sm"
            >
              + Add another collaborator
            </button>
          )}
        </div>

        <div className="flex items-start gap-2 mb-4">
          <input
            type="checkbox"
            id="rules"
            checked={isChecked}
            onChange={() => setIsChecked(!isChecked)}
            className="mt-1"
          />
          <label htmlFor="rules" className="text-sm text-gray-700">
            I have read carefully and agree with these terms and conditions.
          </label>
        </div>

        {isChecked && selfEmailIncluded && (
          <div className='flex items-center gap-2 text-orange-600 border border-orange-600 rounded p-2 mb-4 text-sm'>
            <IoWarningOutline size={18} />
            Your own email cannot be added to this list.
          </div>
        )}

        {hasDuplicateEmails && (
          <div className='flex items-center gap-2 text-red-600 border border-red-600 rounded p-2 mb-4 text-sm'>
            <IoWarningOutline size={18} />
            Duplicate emails are not allowed.
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleAccept}
            disabled={
              !isChecked || 
              emails.some(email => email.trim() === '') || 
              selfEmailIncluded || 
              hasDuplicateEmails ||
              loading
            }
            className={`px-5 py-2 rounded transition font-semibold ${
              isChecked && emails.every(email => email.trim() !== '') && !selfEmailIncluded && !hasDuplicateEmails && !loading
                ? 'bg-purple-700 text-white hover:bg-purple-800 cursor-pointer'
                : 'bg-purple-300 text-white cursor-not-allowed'
            }`}
          >
            {loading ? 'Creating...' : 'Create Collaborative Purchase'}
          </button>
        </div>
      </div>
    </div>
  );
}
