import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, ShoppingBag, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useOrders } from '../context/OrderContext';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';

export default function OrderHistoryPage() {
  const { orders } = useOrders();
  const { addToCart } = useCart();
  const { products } = useProducts();

  const handleReorder = (item) => {
    const fullProduct = products.find(p => p.id === item.id) || item;
    addToCart(fullProduct, 1);
  };

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-20 h-20 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
          <Package size={36} />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">No Orders Placed Yet</h2>
        <p className="text-sm text-slate-500 max-w-sm mx-auto">
          When you place simulated orders, they will appear here and feed into the recommendation engine.
        </p>
        <div className="pt-2">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm rounded-xl shadow-md transition-all"
          >
            Start Shopping <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Order History ({orders.length})
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Review previous simulated transactions and delivery statuses
        </p>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order.orderId}
            className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden"
          >
            {/* Order Header */}
            <div className="bg-slate-50/80 p-4 sm:p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex flex-wrap items-center gap-6">
                <div>
                  <span className="text-slate-400">Order ID:</span>
                  <p className="font-mono font-bold text-slate-900 mt-0.5">{order.orderId}</p>
                </div>
                <div>
                  <span className="text-slate-400">Date Placed:</span>
                  <p className="font-semibold text-slate-800 mt-0.5">
                    {new Date(order.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">Total Amount:</span>
                  <p className="font-bold text-slate-900 mt-0.5">${order.total?.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[11px] flex items-center gap-1">
                  <CheckCircle2 size={13} /> {order.status}
                </span>
              </div>
            </div>

            {/* Items in Order */}
            <div className="p-4 sm:p-6 divide-y divide-slate-100">
              {order.items?.map((item) => (
                <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-2xl border border-slate-200 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Quantity: {item.quantity} • ${item.price} each
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <span className="font-bold text-slate-900 text-sm">
                      ${(item.price * item.quantity).toLocaleString()}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleReorder(item)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-primary-50 text-slate-700 hover:text-primary-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors flex items-center gap-1"
                    >
                      <ShoppingBag size={13} /> Buy Again
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Shipping Info Footer */}
            <div className="bg-slate-50/50 p-4 border-t border-slate-100 text-[11px] text-slate-500 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span>Shipped to: <strong>{order.shippingAddress?.fullName}</strong> ({order.shippingAddress?.city}, {order.shippingAddress?.state})</span>
              <span>Payment: {order.paymentMethod}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

