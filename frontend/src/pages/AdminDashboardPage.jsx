import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  TrendingUp,
  Plus,
  Edit2,
  Trash2,
  Sparkles,
  RotateCcw,
  Check,
  X,
  Search
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useOrders } from '../context/OrderContext';
import { useRecommendation } from '../context/RecommendationContext';
import { CATEGORIES_LIST } from '../data/products';

export default function AdminDashboardPage() {
  const { products, addProduct, updateProduct, deleteProduct, resetProductsToDefault } = useProducts();
  const { orders } = useOrders();
  const { recommendedProducts } = useRecommendation();

  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    name: '',
    category: 'Electronics',
    brand: '',
    price: 99,
    discount: 10,
    stock: 25,
    description: '',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    tags: 'electronics, gadget, smart, portable'
  });

  const totalRevenue = orders.reduce((acc, o) => acc + (o.total || 0), 0);

  const filteredCatalog = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddModal = () => {
    setFormData({
      name: '',
      category: 'Electronics',
      brand: '',
      price: 99,
      discount: 10,
      stock: 25,
      description: '',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      tags: 'electronics, gadget, smart, portable'
    });
    setEditingProduct(null);
    setShowAddModal(true);
  };

  const openEditModal = (prod) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      category: prod.category,
      brand: prod.brand,
      price: prod.price,
      discount: prod.discount || 0,
      stock: prod.stock || 10,
      description: prod.description || '',
      image: prod.image,
      tags: prod.tags.join(', ')
    });
    setShowAddModal(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const tagArray = formData.tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: formData.name,
        category: formData.category,
        brand: formData.brand,
        price: Number(formData.price),
        discount: Number(formData.discount),
        stock: Number(formData.stock),
        description: formData.description,
        image: formData.image,
        tags: tagArray
      });
    } else {
      addProduct({
        name: formData.name,
        category: formData.category,
        brand: formData.brand,
        price: Number(formData.price),
        discount: Number(formData.discount),
        stock: Number(formData.stock),
        description: formData.description,
        image: formData.image,
        tags: tagArray,
        specs: { Category: formData.category, Brand: formData.brand }
      });
    }

    setShowAddModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <LayoutDashboard size={28} className="text-primary-600" />
            Admin Operations Panel
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage product inventory, track simulation metrics, and re-train recommendation weights
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={openAddModal}
            className="px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Plus size={15} /> Add New Product
          </button>
          <button
            type="button"
            onClick={resetProductsToDefault}
            className="px-3.5 py-2.5 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Reset to 42 baseline products"
          >
            <RotateCcw size={13} /> Reset Catalog
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Total Catalog Products</span>
            <Package size={18} className="text-primary-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{products.length}</p>
          <span className="text-[11px] text-emerald-600 font-medium">All indexed in TF-IDF matrix</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Simulated Revenue</span>
            <TrendingUp size={18} className="text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">${totalRevenue.toLocaleString()}</p>
          <span className="text-[11px] text-slate-400">From simulated checkouts</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Active Orders Placed</span>
            <ShoppingCart size={18} className="text-amber-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{orders.length}</p>
          <span className="text-[11px] text-slate-400">Stored locally in browser</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Collaborative Users</span>
            <Users size={18} className="text-purple-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">6 Personas</p>
          <span className="text-[11px] text-primary-600 font-medium">Archetypes for K-NN clustering</span>
        </div>
      </div>

      {/* Product Management Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden space-y-4 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Product Inventory & CRUD Management</h3>
            <p className="text-xs text-slate-500">Add, edit prices, adjust stock, or remove products in real-time</p>
          </div>

          <div className="relative min-w-[220px]">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 rounded-xl text-xs border border-slate-200 outline-none"
            />
            <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-slate-100">
            <thead>
              <tr className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-2">Product</th>
                <th className="py-3 px-2">Category</th>
                <th className="py-3 px-2">Brand</th>
                <th className="py-3 px-2">Price</th>
                <th className="py-3 px-2">Stock</th>
                <th className="py-3 px-2">Rating</th>
                <th className="py-3 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCatalog.slice(0, 15).map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-3">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-9 h-9 object-cover rounded-lg border border-slate-200 flex-shrink-0"
                      />
                      <span className="font-semibold text-slate-800 line-clamp-1 max-w-xs">{prod.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-slate-600 font-medium">{prod.category}</td>
                  <td className="py-3 px-2 text-slate-600">{prod.brand}</td>
                  <td className="py-3 px-2 font-bold text-slate-900">${prod.discountedPrice || prod.price}</td>
                  <td className="py-3 px-2">
                    <span className={`font-semibold ${prod.stock <= 10 ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {prod.stock}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-slate-700">{prod.rating}★</td>
                  <td className="py-3 px-2 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => openEditModal(prod)}
                        className="p-1.5 text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
                        title="Edit product"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteProduct(prod.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                        title="Delete product"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingProduct ? 'Edit Product' : 'Add New Product to Catalog'}
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:bg-white"
                  placeholder="e.g. Sony WH-1000XM6 Wireless Headphones"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none font-semibold text-slate-800"
                  >
                    {CATEGORIES_LIST.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Brand *</label>
                  <input
                    type="text"
                    required
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:bg-white"
                    placeholder="e.g. Sony, Apple, Nike"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Price ($) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Discount (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="90"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Stock Units</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Image URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Tags (Comma-separated keywords for TF-IDF)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none"
                  placeholder="audio, wireless, anc, bluetooth"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none"
                  placeholder="Detailed product features..."
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold shadow-md"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

