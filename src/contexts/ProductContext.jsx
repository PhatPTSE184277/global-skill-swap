import { createContext, useState, useCallback } from "react";
import { fetchAllProducts } from "../services/productService";

const ProductContext = createContext({
  products: [],
  loading: false,
  fetchProducts: async () => {},
  totalPages: 1,
  totalElements: 0,
});

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const fetchProducts = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const response = await fetchAllProducts(params);
      const data = response?.data || {};
      setProducts(data.content || []);
      setTotalPages(data.totalPages || 1);
      setTotalElements(data.totalElements || 0);
      return data;
    } catch (error) {
      console.error(error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    products,
    loading,
    fetchProducts,
    totalPages,
    totalElements,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

export default ProductContext;