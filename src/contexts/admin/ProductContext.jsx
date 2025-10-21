import { createContext, useState, useCallback } from "react";
import {
  fetchAllProducts,
  fetchProductById,
  createProduct,
  updateProductById,
} from "../../services/admin/productService";

const ProductContext = createContext({
  products: [],
  loading: false,
  fetchProducts: async () => {},
  getProduct: async () => null,
  addProduct: async () => {},
  updateProduct: async () => {},
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

  const getProduct = useCallback(async (id) => {
    setLoading(true);
    try {
      const response = await fetchProductById(id);
      return response?.data || null;
    } catch (error) {
      console.error(error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const addProduct = useCallback(
    async (data) => {
      setLoading(true);
      try {
        const response = await createProduct(data);
        await fetchProducts();
        return response?.data;
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [fetchProducts]
  );

  const updateProduct = useCallback(
    async (id, data) => {
      setLoading(true);
      try {
        const response = await updateProductById(id, data);
        await fetchProducts();
        return response?.data;
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [fetchProducts]
  );

  const value = {
    products,
    loading,
    fetchProducts,
    getProduct,
    addProduct,
    updateProduct,
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