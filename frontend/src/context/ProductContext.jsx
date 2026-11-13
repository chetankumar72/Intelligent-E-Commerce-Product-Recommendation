import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_PRODUCTS } from '../data/products';
import { tfidfEngine } from '../ai/tfidf';

const ProductContext = createContext();

const PRODUCTS_STORAGE_KEY = 'nexashop_products_v2';

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse saved products:', e);
    }
    return INITIAL_PRODUCTS;
  });

  // Train TF-IDF whenever products list updates
  useEffect(() => {
    tfidfEngine.fit(products);
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    } catch (e) {
      console.warn('Failed to save products:', e);
    }
  }, [products]);

  // Product CRUD for Admin
  const addProduct = (newProduct) => {
    const productWithId = {
      ...newProduct,
      id: `prod_${Date.now()}`,
      rating: newProduct.rating || 4.5,
      reviewsCount: newProduct.reviewsCount || 1,
      discountedPrice: Math.round(newProduct.price * (1 - (newProduct.discount || 0) / 100)),
      inStock: newProduct.stock > 0
    };
    setProducts(prev => [productWithId, ...prev]);
    return productWithId;
  };

  const updateProduct = (id, updatedFields) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === id) {
          const merged = { ...p, ...updatedFields };
          if (merged.discount && merged.price) {
            merged.discountedPrice = Math.round(merged.price * (1 - merged.discount / 100));
          }
          merged.inStock = (merged.stock ?? p.stock) > 0;
          return merged;
        }
        return p;
      })
    );
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const resetProductsToDefault = () => {
    setProducts(INITIAL_PRODUCTS);
    localStorage.removeItem(PRODUCTS_STORAGE_KEY);
    tfidfEngine.fit(INITIAL_PRODUCTS);
  };

  const getProductById = (id) => {
    return products.find(p => p.id === id);
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        resetProductsToDefault,
        getProductById
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within ProductProvider');
  }
  return context;
}

