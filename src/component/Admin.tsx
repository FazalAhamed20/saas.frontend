import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/Store";
import {
    addProduct,
  fetchAllProducts,
 
} from "../redux/actions/InventoryActions";
import { toast } from "react-toastify";
import { logout } from "../redux/actions/AuthActions";
import { useNavigate } from "react-router-dom";
import AddProductModal from "../utils/modal/AddProductModal";
import { uploadImageToCloudinary } from "../helper/Upload";

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
  const [isLoading,setIsLoading]=useState(false)

  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  

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


  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/login", { replace: false });
  };
  const handleAddItem=async(product: Product)=>{
    setIsLoading(true)
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
    }
    setIsLoading(false)

  }

  return (
    <div className="bg-white shadow-md rounded-lg p-4 md:p-6">
         <div className='flex flex-col md:flex-row md:justify-between mb-4 space-y-2 md:space-y-0'>
              <button
                onClick={() => setIsModalOpen(true)}
                className='px-4 py-2 bg-green-500 text-white rounded w-full md:w-auto'
                aria-label="Add Item"
              >
                Add Product
              </button>
              </div>
        
   
      <div className="flex flex-col md:flex-row md:justify-between mb-4 space-y-2 md:space-y-0">
        
        <input
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={handleSearch}
          className="px-4 py-2 border rounded-md w-full md:w-64"
        />
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded w-full md:w-auto"
        >
          Logout
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border-collapse border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Item Image
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Item Name
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                Category
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
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
    <span>No Image</span> 
  )}
</td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{item.name}</div>
                </td>
                <td className="px-4 py-2 whitespace-nowrap hidden md:table-cell">
                  <div className="text-sm text-gray-900">{item.category}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    
      <div className="flex justify-between mt-4">
        <button
          onClick={handlePreviousPage}
          className="px-3 py-1 border rounded-md bg-gray-200"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          className="px-3 py-1 border rounded-md bg-gray-200"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
      <AddProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddItem={handleAddItem} isLoading={isLoading}/>
    </div>
  );
};

export default AdminTable;