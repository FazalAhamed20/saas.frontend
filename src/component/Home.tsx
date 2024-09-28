import React, { useCallback, useEffect, useState } from "react";
import AddItemModal from "../utils/modal/AddItemModal";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../redux/Store";
import { Plus, FileText, Download, LogOut, Search, X, DollarSign, Menu } from 'lucide-react';
import {
  addItem,
  deleteItem,
  fetchAllItem,
  updateItem,
} from "../redux/actions/InventoryActions";
import { toast } from "react-toastify";
import EditItemModal from "../utils/modal/EditItemModal";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { logout } from "../redux/actions/AuthActions";
import { useNavigate } from "react-router-dom";

import BillManagement from "./BillManagement";
import { useTheme } from "../context/ThemeContext";
import RecentOrders from "./RecentOrder";
interface Item {
  id?: string;
  _id?: string | null;
  name: string;
  quantity: number;
  description: string;
  price: number;
  category: string;
  image: string;
}

const InventoryTable: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showBillManagement, setShowBillManagement] = useState(false);
  const [isLogout, setIsLogout] = useState(false);
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [showRecentSales, setShowRecentSales] = useState(false);
  const [Loading, setLoading] = useState<string | null | undefined>(null);
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
 
  const userId = useSelector((state: any) => state?.auth?.user?.user?.UserId);
  const { darkMode } = useTheme();

  console.log(userId);

  const fetchAllProduct = useCallback(async () => {
    const response = await dispatch(fetchAllItem({ userId }));
    if (response.payload?.success) {
      setItems(response.payload.data?.data);
      setFilteredItems(response.payload.data?.data);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchAllProduct();
  }, [fetchAllProduct]);
  console.log(items);

  useEffect(() => {
    const filtered = items.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filtered);
    setCurrentPage(1);
  }, [searchTerm, items]);

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
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const handleAddItem = async (item: any) => {
    console.log(item);

    const response = await dispatch(addItem(item));
    if (response.payload?.success) {
      toast.success(response.payload?.message);
      fetchAllProduct();
    } else {
      toast.error(response.payload?.message);
    }
  };

  const handleEditClick = (item: Item) => {
    setEditingItem(item);
    setIsEditModalOpen(true);
  };

  const handleEditItem = async (editedItem: any) => {
    console.log(editedItem);

    const response = await dispatch(updateItem(editedItem));
    if (response.payload?.success) {
      toast.success(response.payload?.message);
      fetchAllProduct();
    }
  };

  const handleDeleteItem = async (itemId: string | null | undefined) => {
    setLoading(itemId);
    const data = {
      _id: itemId,
    };
    const response = await dispatch(deleteItem(data));
    if (response.payload?.success) {
      toast.success(response.payload?.message);
      fetchAllProduct();
    } else {
      toast.error("Failed to delete item");
    }
    setLoading(null);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Inventory Report", 14, 15);

    const tableColumn = ["Name", "Quantity", "Description"];
    const tableRows = filteredItems.map((item) => [
      item.name,
      item.quantity,
      item.description,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("inventory_report.pdf");
  };

  const handleLogout = async () => {
    setIsLogout(true);
    const response = await dispatch(logout());
    console.log("logout", response);

    navigate("/login", { replace: false });
    setIsLogout(false);
  };
  const handleBillFinalized = () => {
    fetchAllProduct();
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      
      <div className={`fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto transition duration-300 transform ${
        isSideNavOpen ? 'translate-x-0' : '-translate-x-full'
      } ${darkMode ? 'bg-gray-800' : 'bg-white'} ${darkMode ? 'text-white' : 'text-gray-900'} md:translate-x-0 top-16 bottom-0`}>
        <div className="flex items-center justify-between p-4">
        
          <button onClick={() => setIsSideNavOpen(false)} className="p-1 md:hidden">
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="mt-5">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full px-4 py-2 text-left hover:bg-opacity-20 hover:bg-gray-600"
          >
            <Plus className="inline-block w-5 h-5 mr-2" />
            Add Item
          </button>
          <button
            onClick={() => setShowBillManagement(!showBillManagement)}
            className="w-full px-4 py-2 text-left hover:bg-opacity-20 hover:bg-gray-600"
          >
            <FileText className="inline-block w-5 h-5 mr-2" />
            {showBillManagement ? 'Show Inventory' : 'Show Bill Management'}
          </button>
          <button
            onClick={() => setShowRecentSales(!showRecentSales)}
            className="w-full px-4 py-2 text-left hover:bg-opacity-20 hover:bg-gray-600"
          >
            <DollarSign className="inline-block w-5 h-5 mr-2" />
            {showRecentSales ? 'Hide Recent Sales' : 'Show Recent Sales'}
          </button>
          <button
            onClick={generatePDF}
            className="w-full px-4 py-2 text-left hover:bg-opacity-20 hover:bg-gray-600"
          >
            <Download className="inline-block w-5 h-5 mr-2" />
            Download PDF
          </button>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-left hover:bg-opacity-20 hover:bg-gray-600"
            disabled={isLogout}
          >
            <LogOut className="inline-block w-5 h-5 mr-2" />
            {isLogout ? 'Logging out...' : 'Logout'}
          </button>
        </nav>
      </div>

     
      <div className="md:pl-64 pt-16">
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md rounded-lg p-4 md:p-6 m-4`}>
          
          <button
            onClick={() => setIsSideNavOpen(!isSideNavOpen)}
            className="md:hidden p-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500 mb-4"
          >
            <Menu className="w-6 h-6" />
          </button>

          
            <>
              <div className='mb-6'>
                <div className='relative'>
                  <input
                    type="text"
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className={`pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'
                    }`}
                  />
                  <Search className={`w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
              </div>

              {showRecentSales ? (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">Recent Sales</h3>
                  
                <RecentOrders/>
                </div>
              ):

              showBillManagement ? (
                <BillManagement onBillFinalized={handleBillFinalized} />
              ) : (
                <>
                  <div className='overflow-x-auto'>
                    {paginatedItems.length === 0 ? (
                      <div className={`text-center py-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        No inventories available.
                      </div>
                    ) : (
                      <table className={`min-w-full border-collapse ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                        <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                          <tr>
                            {['Image', 'Item Name', 'Quantity', 'Price', 'Category', 'Description', 'Actions'].map((header) => (
                              <th key={header} className={`px-4 py-2 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider ${header === 'Description' ? 'hidden md:table-cell' : ''}`}>
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className={`${darkMode ? 'divide-gray-700' : 'divide-gray-200'} divide-y`}>
                          {paginatedItems.map((item) => (
                            <tr key={item._id}>
                              <td className="px-4 py-2 whitespace-nowrap">
                                {item.image ? (
                                  <img
                                    src={typeof item.image === "string" ? item.image : URL.createObjectURL(item.image)}
                                    alt={item.name}
                                    className="w-16 h-auto"
                                  />
                                ) : (
                                  <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>No Image</span>
                                )}
                              </td>
                              <td className={`px-4 py-2 whitespace-nowrap ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                                {item.name}
                              </td>
                              <td className={`px-4 py-2 whitespace-nowrap ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                                {item.quantity}
                              </td>
                              <td className={`px-4 py-2 whitespace-nowrap ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                                ₹{item.price}
                              </td>
                              <td className={`px-4 py-2 whitespace-nowrap ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                                {item.category}
                              </td>
                              <td className={`px-4 py-2 whitespace-nowrap hidden md:table-cell ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                                <div className="truncate max-w-xs">
                                  {item.description}
                                </div>
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap">
                                <button
                                  onClick={() => handleEditClick(item)}
                                  className="px-2 py-1 text-xs bg-blue-500 text-white rounded mr-1 hover:bg-blue-600 transition-colors duration-300"
                                  aria-label={`Edit ${item.name}`}
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteItem(item._id)}
                                  className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-300"
                                  aria-label={`Delete ${item.name}`}
                                  disabled={Loading === item._id}
                                >
                                  {Loading === item._id ? "Deleting..." : "Delete"}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                  <div className='flex justify-between mt-4'>
                    <button 
                      onClick={handlePreviousPage} 
                      className={`px-3 py-1 border rounded-md transition-colors duration-300 ${
                        darkMode 
                          ? 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600' 
                          : 'bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300'
                      }`} 
                      disabled={currentPage === 1} 
                      aria-label="Previous Page"
                    >
                      Previous
                    </button>
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                      Page {currentPage} of {totalPages}
                    </span>
                    <button 
                      onClick={handleNextPage} 
                      className={`px-3 py-1 border rounded-md transition-colors duration-300 ${
                        darkMode 
                          ? 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600' 
                          : 'bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300'
                      }`} 
                      disabled={currentPage === totalPages} 
                      aria-label="Next Page"
                    >
                      Next
                    </button>
                  </div>
                </>
              )}

              <AddItemModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddItem={handleAddItem} />
              <EditItemModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onEditItem={handleEditItem} item={editingItem} />
            </>
         
        </div>
      </div>
    </div>
  );
};

export default InventoryTable;