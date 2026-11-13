import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CreditCard,
  QrCode,
  Truck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShoppingBag,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, rawSubtotal, shipping, tax, finalTotal, couponDiscount, clearCart } = useCart();
  const { currentUser } = useAuth();
  const { placeOrder } = useOrders();

  // Form states
  const [formData, setFormData] = useState({
    fullName: currentUser.name !== 'New Visitor (Cold Start)' ? currentUser.name : '',
    email: currentUser.email || 'alex.rivera@example.com',
    phone: '+1 (555) 382-9401',
    street: '742 Evergreen Terrace',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94107',
    country: 'United States'
  });

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '4242 •••• •••• 4242',
    expDate: '12/28',
    cvv: '888',
    cardName: currentUser.name || 'Alex Rivera'
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Your cart is empty</h2>
        <p className="text-xs text-slate-500">You need to have items in your cart to proceed with checkout.</p>
        <Link to="/shop" className="inline-block px-5 py-2.5 bg-primary-600 text-white rounded-xl text-xs font-semibold">
          Browse Products
        </Link>
      </div>
    );
  }

  const validateForm = () => {
    const errors = {};
    if (!formData.fullName.trim()) errors.fullName = 'Full name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) errors.email = 'Valid email is required';
    if (!formData.street.trim()) errors.street = 'Street address is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.zipCode.trim()) errors.zipCode = 'ZIP / Postal code is required';
    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const orderPayload = {
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.discountedPrice || item.price,
          quantity: item.quantity,
          image: item.image,
          category: item.category
        })),
        shippingAddress: { ...formData },
        paymentMethod: paymentMethod === 'card' ? 'Credit Card (Simulated)' : paymentMethod === 'upi' ? 'Instant UPI QR (Simulated)' : 'Cash on Delivery',
        subtotal: rawSubtotal,
        discount: couponDiscount,
        shipping,
        tax,
        total: finalTotal
      };

      const createdOrder = placeOrder(orderPayload);
      clearCart();

      // Trigger celebratory confetti effect
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // Fallback gracefully
      }

      setIsSubmitting(false);
      navigate(`/order-confirmation/${createdOrder.orderId}`);
    }, 900);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Simulated Secure Checkout
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Academic project demonstration flow. No real payments or financial data are processed.
        </p>
      </div>

      {/* Simulated Notice Banner */}
      <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2.5">
        <AlertCircle size={18} className="text-amber-600 flex-shrink-0" />
        <div>
          <strong>Educational Demonstration Mode:</strong> Card details below are pre-filled dummy credentials. Placing this order updates your recommendation profile with newly purchased product vectors!
        </div>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Customer & Delivery Information */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Customer Details */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
              <span className="w-5 h-5 rounded-full bg-primary-600 text-white flex items-center justify-center text-[10px]">1</span>
              Customer Contact Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`w-full p-2.5 bg-slate-50 rounded-xl border ${formErrors.fullName ? 'border-rose-500' : 'border-slate-200'} outline-none focus:bg-white`}
                  placeholder="John Doe"
                />
                {formErrors.fullName && <p className="text-[10px] text-rose-600 mt-1">{formErrors.fullName}</p>}
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full p-2.5 bg-slate-50 rounded-xl border ${formErrors.email ? 'border-rose-500' : 'border-slate-200'} outline-none focus:bg-white`}
                  placeholder="john@example.com"
                />
                {formErrors.email && <p className="text-[10px] text-rose-600 mt-1">{formErrors.email}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-semibold mb-1">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Delivery Address */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
              <span className="w-5 h-5 rounded-full bg-primary-600 text-white flex items-center justify-center text-[10px]">2</span>
              Shipping & Delivery Address
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-semibold mb-1">Street Address *</label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  className={`w-full p-2.5 bg-slate-50 rounded-xl border ${formErrors.street ? 'border-rose-500' : 'border-slate-200'} outline-none focus:bg-white`}
                />
                {formErrors.street && <p className="text-[10px] text-rose-600 mt-1">{formErrors.street}</p>}
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={`w-full p-2.5 bg-slate-50 rounded-xl border ${formErrors.city ? 'border-rose-500' : 'border-slate-200'} outline-none focus:bg-white`}
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">State / Region</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">ZIP / Postal Code *</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  className={`w-full p-2.5 bg-slate-50 rounded-xl border ${formErrors.zipCode ? 'border-rose-500' : 'border-slate-200'} outline-none focus:bg-white`}
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Payment Method */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
              <span className="w-5 h-5 rounded-full bg-primary-600 text-white flex items-center justify-center text-[10px]">3</span>
              Payment Method Simulation
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div
                onClick={() => setPaymentMethod('card')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'card'
                    ? 'border-primary-500 bg-primary-50/50 shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <CreditCard size={18} className="text-primary-600 mb-2" />
                <p className="text-xs font-bold text-slate-900">Simulated Card</p>
                <span className="text-[10px] text-slate-500">Instant approval</span>
              </div>

              <div
                onClick={() => setPaymentMethod('upi')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'upi'
                    ? 'border-primary-500 bg-primary-50/50 shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <QrCode size={18} className="text-primary-600 mb-2" />
                <p className="text-xs font-bold text-slate-900">Simulated UPI</p>
                <span className="text-[10px] text-slate-500">QR code payment</span>
              </div>

              <div
                onClick={() => setPaymentMethod('cod')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-primary-500 bg-primary-50/50 shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Truck size={18} className="text-primary-600 mb-2" />
                <p className="text-xs font-bold text-slate-900">Cash on Delivery</p>
                <span className="text-[10px] text-slate-500">Pay upon arrival</span>
              </div>
            </div>

            {paymentMethod === 'card' && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 text-xs">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Card Number (Simulated)</label>
                  <input
                    type="text"
                    value={cardDetails.cardNumber}
                    readOnly
                    className="w-full p-2 bg-white rounded-lg border border-slate-200 font-mono text-slate-700"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Expiration</label>
                    <input
                      type="text"
                      value={cardDetails.expDate}
                      readOnly
                      className="w-full p-2 bg-white rounded-lg border border-slate-200 font-mono text-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">CVV</label>
                    <input
                      type="text"
                      value={cardDetails.cvv}
                      readOnly
                      className="w-full p-2 bg-white rounded-lg border border-slate-200 font-mono text-slate-700"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Review & Submit */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
          <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center justify-between">
            <span>Order Summary</span>
            <span className="text-xs font-semibold text-slate-400">({cartItems.length} items)</span>
          </h3>

          <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 pr-1">
            {cartItems.map((item) => (
              <div key={item.id} className="py-2.5 flex items-center justify-between text-xs gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-10 h-10 object-cover rounded-lg border border-slate-200 flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 truncate">{item.name}</p>
                    <p className="text-[11px] text-slate-500">Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="font-bold text-slate-900">
                  ${((item.discountedPrice || item.price) * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${rawSubtotal.toLocaleString()}</span>
            </div>
            {couponDiscount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Discount applied</span>
                <span>-${couponDiscount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shipping === 0 ? <strong className="text-emerald-600">FREE</strong> : `$${shipping}`}</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Tax</span>
              <span>${tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-200">
              <span>Total Payment</span>
              <span className="text-primary-600 text-xl font-black">${finalTotal.toLocaleString()}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-bold text-sm rounded-xl shadow-lg shadow-primary-500/25 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                Processing Order...
              </span>
            ) : (
              <>
                <Lock size={15} /> Place Simulated Order (${finalTotal.toLocaleString()})
              </>
            )}
          </button>

          <p className="text-[11px] text-slate-400 text-center leading-relaxed">
            By clicking place order, this simulated purchase is finalized and added to the user-item interaction matrix.
          </p>
        </div>
      </form>
    </div>
  );
}

