import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, Sparkles, Truck, Calendar, ShoppingBag } from 'lucide-react';
import { useOrders } from '../context/OrderContext';

export default function OrderConfirmationPage() {
  const { orderId } = useParams();
  const { getOrderById } = useOrders();

  const order = getOrderById(orderId);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      {/* Top Banner */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle size={36} />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Simulated Order Confirmed!
        </h1>

        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          Thank you for testing the e-commerce purchase flow. Your order identifier is{' '}
          <strong className="text-primary-600 font-mono">{orderId}</strong>.
        </p>

        {/* AI Learning Notification Pill */}
        <div className="inline-flex items-center gap-2 p-3 bg-gradient-to-r from-primary-50 to-indigo-50 border border-primary-200 rounded-2xl text-xs text-primary-800 text-left max-w-lg">
          <Sparkles size={20} className="text-primary-600 flex-shrink-0 animate-pulse" />
          <div>
            <strong>AI Model Updated:</strong> The items in this order have been recorded as implicit rating (5.0★) in your profile vector. Future recommendations will dynamically adapt to these purchases!
          </div>
        </div>
      </div>

      {/* Order Details Card */}
      {order && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 text-xs">
            <div>
              <span className="text-slate-400">Order Placed:</span>
              <p className="font-bold text-slate-800 mt-0.5">
                {new Date(order.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>

            <div>
              <span className="text-slate-400">Status:</span>
              <p className="font-bold text-emerald-600 mt-0.5">{order.status}</p>
            </div>

            <div>
              <span className="text-slate-400">Total:</span>
              <p className="font-bold text-slate-900 mt-0.5">${order.total?.toLocaleString()}</p>
            </div>
          </div>

          {/* Delivery & Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <span className="font-bold text-slate-700 flex items-center gap-1.5 mb-1">
                <Truck size={14} className="text-primary-600" /> Delivery Address
              </span>
              <p className="font-semibold text-slate-800">{order.shippingAddress?.fullName}</p>
              <p className="text-slate-500">{order.shippingAddress?.street}</p>
              <p className="text-slate-500">
                {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <span className="font-bold text-slate-700 flex items-center gap-1.5 mb-1">
                <Calendar size={14} className="text-primary-600" /> Estimated Timeline
              </span>
              <p className="font-semibold text-slate-800">{order.estimatedDelivery}</p>
              <p className="text-slate-500">Payment: {order.paymentMethod}</p>
              <span className="inline-block mt-1 text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-bold">
                Simulated Transaction
              </span>
            </div>
          </div>

          {/* Items Summary */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Purchased Items
            </h4>
            <div className="divide-y divide-slate-100">
              {order.items?.map((item) => (
                <div key={item.id} className="py-2.5 flex items-center justify-between text-xs gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-xl border border-slate-200"
                    />
                    <div>
                      <p className="font-bold text-slate-800">{item.name}</p>
                      <p className="text-[11px] text-slate-500">Qty: {item.quantity} • ${item.price}</p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900">
                    ${(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Navigation Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link
          to="/ai-dashboard"
          className="w-full sm:w-auto px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2"
        >
          <Sparkles size={16} /> Check Updated AI Dashboard
        </Link>
        <Link
          to="/orders"
          className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
        >
          View Order History
        </Link>
        <Link
          to="/shop"
          className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
        >
          Continue Shopping <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

