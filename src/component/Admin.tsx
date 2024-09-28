import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/Store";
import {
    addProduct,
  deleteProduct,
  fetchAllProducts,
 
} from "../redux/actions/InventoryActions";
import { toast } from "react-toastify";

import AddProductModal from "../utils/modal/AddProductModal";
import { uploadImageToCloudinary } from "../helper/Upload";
import { useTheme } from "../context/ThemeContext";
import { Plus } from "lucide-react";

interface Product {
    id: string;
    _id?: string | null;
    name: string;
    category: string;
    image: File | null 
  }

const AdminTable: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredItems, setFilteredItems] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
 
  const { darkMode } = useTheme();
  const dispatch: AppDispatch = useDispatch();
  
  

  const fetchAllProduct = useCallback(async () => {
    const response = await dispatch(fetchAllProducts());
    if (response.payload?.success) {
      setProducts(response.payload.data?.data);
      setFilteredItems(response.payload.data?.data);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchAllProduct();
  }, [fetchAllProduct]);

  
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm) {
        const filtered = products.filter(
          (products) =>
            products.name.toLowerCase().includes(searchTerm.toLowerCase()) 
        );
        setFilteredItems(filtered);
      } else {
        setFilteredItems(products);
      }
      setCurrentPage(1); 
    }, 300); 

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, products]);

 
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(3);
      } else {
        setItemsPerPage(5);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);



  const handleAddItem=async(product: Product)=>{
  
    let cloudinaryUrl = product.image;
   

    if (product.image instanceof File) {
      try {
        cloudinaryUrl = await uploadImageToCloudinary(product.image);
      } catch (error) {
        console.error('Image upload failed:', error);
        return;
      }
    }
    
    const updatedProduct = { ...product, image: cloudinaryUrl };
    const response = await dispatch(addProduct(updatedProduct));
    if (response.payload?.success) {
       
        toast.success(response.payload?.message);
        
        fetchAllProduct();
    }else{
        toast.error(response.payload?.message);
    }
  

  }
  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
        setDeletingProductId(productId);
      try {
        const response = await dispatch(deleteProduct(productId));
        if (response.payload?.success) {
          toast.success(response.payload.message);
          fetchAllProduct();
        } else {
          toast.error(response.payload?.message || "Failed to delete product");
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("Failed to delete product");
      } finally {
        setDeletingProductId(null); 
      }
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md rounded-lg p-4 md:p-6`}>
        <div className='flex justify-between items-center mb-4'>
          
          <button
                  onClick={() => setIsModalOpen(true)}
                  className='px-4 py-2 bg-green-500 text-white rounded flex items-center justify-center transition-colors duration-300 hover:bg-green-600'
                  aria-label="Add Item"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Item
                </button>
          
        </div>

        <div className="flex flex-col md:flex-row md:justify-between mb-4 space-y-2 md:space-y-0">
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={handleSearch}
            className={`px-4 py-2 border rounded-md w-full md:w-64 ${
              darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'
            }`}
          />
        </div>

        <div className="overflow-x-auto">
          <table className={`min-w-full border-collapse ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>
                <th className={`px-4 py-2 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                  Item Image
                </th>
                <th className={`px-4 py-2 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                  Item Name
                </th>
                <th className={`px-4 py-2 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider hidden md:table-cell`}>
                  Category
                </th>
                <th className={`px-4 py-2 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={`${darkMode ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'} divide-y`}>
              {paginatedItems.map((item) => (
                <tr key={item._id}>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {item.image ? (
                      <img
                        src={typeof item.image === 'string' ? item.image : URL.createObjectURL(item.image)}
                        alt={item.name}
                        className="w-16 h-auto"
                      />
                    ) : (
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>No Image</span>
                    )}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>{item.name}</div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap hidden md:table-cell">
                    <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>{item.category}</div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <button
                      onClick={() => handleDeleteProduct(item._id || '')}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      disabled={deletingProductId === item._id}
                    >
                      {deletingProductId === item._id ? (
                        <div className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Deleting...
                        </div>
                      ) : (
                        'Delete'
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between mt-4">
          <button
            onClick={handlePreviousPage}
            className={`px-3 py-1 border rounded-md ${
              darkMode
                ? 'bg-gray-700 text-gray-300 border-gray-600'
                : 'bg-gray-200 text-gray-700 border-gray-300'
            }`}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            className={`px-3 py-1 border rounded-md ${
              darkMode
                ? 'bg-gray-700 text-gray-300 border-gray-600'
                : 'bg-gray-200 text-gray-700 border-gray-300'
            }`}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
      <AddProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddItem={handleAddItem} />
    </div>
  );
};

export default AdminTable;