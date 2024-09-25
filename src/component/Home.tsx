import React, { useCallback, useEffect, useState } from 'react';
import AddItemModal from '../utils/modal/AddItemModal';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../redux/Store';
import { addItem, deleteItem, fetchAllItem, updateItem } from '../redux/actions/InventoryActions';
import { toast } from 'react-toastify';
import EditItemModal from '../utils/modal/EditItemModal';
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import { logout } from '../redux/actions/AuthActions';
import { useNavigate } from 'react-router-dom';
import AdminTable from './Admin';
import BillManagement from './BillManagement';
interface Item {
  id?: string;
  _id?: string | null
  name: string;
  quantity: number;
  description: string;
  price: number;
  category: string;
  image:string
}

const InventoryTable: React.FC = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [filteredItems, setFilteredItems] = useState<Item[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Item | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showBillManagement, setShowBillManagement] = useState(false);
    const [isLogout,setIsLogout]=useState(false)
    const [Loading,setLoading]=useState< string | null | undefined>(null)
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
    const isAdmin = useSelector((state: any) => state?.auth?.user?.user?.isAdmin);
    const userId = useSelector((state: any) => state?.auth?.user?.user?.UserId);

    console.log(userId);
    

    const fetchAllProduct = useCallback(async () => {
        const response = await dispatch(fetchAllItem({userId}));
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
        const filtered = items.filter(item =>
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
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleNextPage = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };

    const handlePreviousPage = () => {
        setCurrentPage(prevPage => prevPage - 1);
    };

    const paginatedItems = filteredItems.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
    );

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

    const handleAddItem = async (item: any) => {
        console.log(item);
        
        const response = await dispatch(addItem(item));
        if (response.payload?.success) {
            toast.success(response.payload?.message);
            fetchAllProduct();
        }else{
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
        setLoading(itemId)
        const data = {
            _id: itemId
        }
        const response = await dispatch(deleteItem(data));
        if (response.payload?.success) {
            toast.success(response.payload?.message);
            fetchAllProduct();
        } else {
            toast.error('Failed to delete item');
        }
        setLoading(null)
    };

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text("Inventory Report", 14, 15);
        
        const tableColumn = ["Name", "Quantity", "Description"];
        const tableRows = filteredItems.map(item => [item.name, item.quantity, item.description]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 20
        });

        doc.save("inventory_report.pdf");
    };

    const handleLogout = async () => {
        setIsLogout(true)
        const response=await dispatch(logout());
        console.log("logout",response);
        
        navigate('/login', { replace: false });
        setIsLogout(false)
    }
    const handleBillFinalized=()=>{
        fetchAllProduct()
    }

    return (
        <div className='bg-white shadow-md rounded-lg p-4 md:p-6'>
          <h2 className='text-xl font-bold mb-4'>Inventory</h2>
          {isAdmin ? (
            <AdminTable />
          ) : (
            <>
              <div className='flex flex-col md:flex-row md:justify-between mb-4 space-y-2 md:space-y-0'>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className='px-4 py-2 bg-green-500 text-white rounded w-full md:w-auto'
                  aria-label="Add Item"
                >
                  Add Item
                </button>
                <button
                  onClick={() => setShowBillManagement(!showBillManagement)}
                  className='px-4 py-2 bg-blue-500 text-white rounded w-full md:w-auto'
                  aria-label="Toggle Bill Management"
                >
                  {showBillManagement ? 'Show Inventory' : 'Show Bill Management'}
                </button>
                <button
                  onClick={generatePDF}
                  className='px-4 py-2 bg-purple-500 text-white rounded w-full md:w-auto'
                  aria-label="Download Inventory PDF"
                >
                  Download Inventory PDF
                </button>
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className='px-4 py-2 border rounded-md w-full md:w-64'
                />
             
                <button
                  onClick={handleLogout}
                  className='px-4 py-2 bg-red-500 text-white rounded w-full md:w-auto'
                  aria-label="Logout"
                  disabled={isLogout}
                >
                    {isLogout ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  ...
                </div>
              ) : 'Logout'}
                </button>
              </div>
              {showBillManagement ? (
                <BillManagement onBillFinalized={handleBillFinalized} />
              ) : (
                <>
                  <div className='overflow-x-auto'>
                  {paginatedItems.length === 0 ? (
                <div className='text-center py-4 text-gray-500'>
                  No inventories available.
                </div>
              ) : (
                    <table className='min-w-full bg-white border-collapse border border-gray-200'>
                      <thead className='bg-gray-50'>
                        <tr>
                        <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Image</th>
                          <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Item Name</th>
                          <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Quantity</th>
                          <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Price</th>
                          <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Category</th>
                          <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell'>Description</th>
                          <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Actions</th>
                        </tr>
                      </thead>
                      <tbody className='bg-white divide-y divide-gray-200'>
                        {paginatedItems.map(item => (
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
                            <td className='px-4 py-2 whitespace-nowrap'>
                              <div className='text-sm text-gray-900'>{item.name}</div>
                            </td>
                            <td className='px-4 py-2 whitespace-nowrap'>
                              <div className='text-sm text-gray-900'>{item.quantity}</div>
                            </td>
                            <td className='px-4 py-2 whitespace-nowrap'>
                              <div className='text-sm text-gray-900'>₹{item.price}</div>
                            </td>
                            <td className='px-4 py-2 whitespace-nowrap'>
                              <div className='text-sm text-gray-900'>{item.category}</div>
                            </td>
                            <td className='px-4 py-2 whitespace-nowrap hidden md:table-cell'>
                              <div className='text-sm text-gray-900 truncate max-w-xs'>{item.description}</div>
                            </td>
                            <td className='px-4 py-2 whitespace-nowrap'>
                              <button onClick={() => handleEditClick(item)} className='px-2 py-1 text-xs bg-blue-500 text-white rounded mr-1' aria-label={`Edit ${item.name}`}>
                                Edit
                              </button>
                              <button onClick={() => handleDeleteItem(item._id)} className='px-2 py-1 text-xs bg-red-500 text-white rounded' aria-label={`Delete ${item.name}`} disabled={Loading===item._id}>
                                {
                                    Loading===item._id ? 'Deleting...' : 'Delete'
                                }
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                     )}
                  </div>
                  <div className='flex justify-between mt-4'>
                    <button onClick={handlePreviousPage} className='px-3 py-1 border rounded-md bg-gray-200' disabled={currentPage === 1} aria-label="Previous Page">
                      Previous
                    </button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button onClick={handleNextPage} className='px-3 py-1 border rounded-md bg-gray-200' disabled={currentPage === totalPages} aria-label="Next Page">
                      Next
                    </button>
                  </div>
                </>
              )}
              <AddItemModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddItem={handleAddItem} />
              <EditItemModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onEditItem={handleEditItem} item={editingItem} />
            </>
          )}
        </div>
      );
    };

export default InventoryTable;