'use client';

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'sonner';
import { Calendar, Clock, Users, DollarSign, X, CheckCircle, AlertCircle } from 'lucide-react';

export default function CollaborativePurchasesDashboard() {
  const { user } = useSelector(state => state.userState);
  const [collaborativePurchases, setCollaborativePurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollaborativePurchases = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/collaborative-purchases`, {
          withCredentials: true
        });
        setCollaborativePurchases(res.data.collaborativePurchases || []);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load collaborative purchases');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchCollaborativePurchases();
    }
  }, [user]);

  const handleCancel = async (purchaseId) => {
    if (!window.confirm('Are you sure you want to cancel this collaborative purchase? This will refund any paid participants.')) {
      return;
    }

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/collaborative-purchases/${purchaseId}/cancel`, {}, {
        withCredentials: true
      });
      
      toast.success('Collaborative purchase cancelled successfully');
      
      // Refresh the list
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/collaborative-purchases`, {
        withCredentials: true
      });
      setCollaborativePurchases(res.data.collaborativePurchases || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to cancel collaborative purchase');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      case 'expired': return 'text-gray-600 bg-gray-100';
      case 'refunded': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <X className="w-4 h-4" />;
      case 'expired': return <AlertCircle className="w-4 h-4" />;
      case 'refunded': return <DollarSign className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatTimeRemaining = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diff = deadlineDate - now;
    
    if (diff <= 0) return 'Expired';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getParticipantStatus = (participants, userEmail) => {
    const userParticipant = participants.find(p => p.email === userEmail);
    if (userParticipant) {
      return userParticipant.paymentStatus;
    }
    return 'creator';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading collaborative purchases...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Collaborative Purchases</h1>
          <p className="mt-2 text-gray-600">Track and manage your collaborative purchases</p>
        </div>

        {collaborativePurchases.length === 0 ? (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No collaborative purchases</h3>
            <p className="mt-1 text-sm text-gray-500">You haven't created or participated in any collaborative purchases yet.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {collaborativePurchases.map((purchase) => {
              const userStatus = getParticipantStatus(purchase.participants, user?.email);
              const isCreator = purchase.createdBy._id === user?._id;
              const timeRemaining = formatTimeRemaining(purchase.deadline);
              const isExpired = new Date(purchase.deadline) < new Date();
              
              return (
                <div key={purchase._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">{purchase.productName}</h3>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(purchase.status)}`}>
                          {getStatusIcon(purchase.status)}
                          {purchase.status.charAt(0).toUpperCase() + purchase.status.slice(1)}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <DollarSign className="w-4 h-4" />
                          <span>Total: ${purchase.totalAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <DollarSign className="w-4 h-4" />
                          <span>Your Share: ${purchase.shareAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="w-4 h-4" />
                          <span>{purchase.participants.length + 1} participants</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>Created: {new Date(purchase.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span className={isExpired ? 'text-red-600' : 'text-gray-600'}>
                            {isExpired ? 'Expired' : `Expires in ${timeRemaining}`}
                          </span>
                        </div>
                      </div>

                      {/* Participants Status */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Participants Status</h4>
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-sm">
                            <span className="font-medium">{purchase.createdBy.firstName || purchase.createdBy.email}</span>
                            <span className="text-green-600 font-semibold">Creator</span>
                          </div>
                          {purchase.participants.map((participant, idx) => (
                            <div key={idx} className="flex justify-between items-center text-sm">
                              <span>{participant.email}</span>
                              <span className={`font-semibold ${
                                participant.paymentStatus === 'paid' ? 'text-green-600' :
                                participant.paymentStatus === 'declined' ? 'text-red-600' :
                                'text-yellow-600'
                              }`}>
                                {participant.paymentStatus === 'paid' ? 'Paid' :
                                 participant.paymentStatus === 'declined' ? 'Declined' :
                                 'Pending'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Your Status */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-1">Your Status</h4>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          userStatus === 'creator' ? 'text-blue-600 bg-blue-100' :
                          userStatus === 'paid' ? 'text-green-600 bg-green-100' :
                          userStatus === 'declined' ? 'text-red-600 bg-red-100' :
                          'text-yellow-600 bg-yellow-100'
                        }`}>
                          {userStatus === 'creator' ? 'Creator' :
                           userStatus === 'paid' ? 'Paid' :
                           userStatus === 'declined' ? 'Declined' :
                           'Pending Payment'}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 ml-4">
                      {isCreator && purchase.status === 'pending' && !isExpired && (
                        <button
                          onClick={() => handleCancel(purchase._id)}
                          className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          Cancel Purchase
                        </button>
                      )}
                      
                      {purchase.status === 'completed' && purchase.orderId && (
                        <button
                          onClick={() => window.open(`/user/history`, '_blank')}
                          className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          View Order
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
