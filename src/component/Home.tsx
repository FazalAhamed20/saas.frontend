import React, { useCallback, useEffect, useState } from 'react';
import AddItemModal from '../utils/modal/AddItemModal';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../redux/Store';
import { addItem, deleteItem, fetchAllProducts, updateItem } from '../redux/actions/InventoryActions';
import { toast } from 'react-toastify';
import EditItemModal from '../utils/modal/EditItemModal';
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import { logout } from '../redux/actions/AuthActions';
import { useNavigate } from 'react-router-dom';

interface Item {
  id: string;
  _id?: string | null
  name: string;
  quantity: number;
  description: string;
}

const InventoryTable: React.FC = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [filteredItems, setFilteredItems] = useState<Item[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Item | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
    const isAdmin = useSelector((state: any) => state?.auth?.user?.user.isAdmin);

    console.log(isAdmin);
    

    const fetchAllProduct = useCallback(async () => {
        const response = await dispatch(fetchAllProducts());
        if (response.payload?.success) {
            setItems(response.payload.data?.data);
            setFilteredItems(response.payload.data?.data);
        }
    }, [dispatch]);

    useEffect(() => {
        fetchAllProduct();
    }, [fetchAllProduct]);

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

    const handleAddItem = async (item: Item) => {
        const response = await dispatch(addItem(item));
        if (response.payload?.success) {
            toast.success(response.payload?.message);
            fetchAllProduct();
        }
    };

    const handleEditClick = (item: Item) => {
        setEditingItem(item);
        setIsEditModalOpen(true);
    };

    const handleEditItem = async (editedItem: Item) => {
        const response = await dispatch(updateItem(editedItem));
        if (response.payload?.success) {
            toast.success(response.payload?.message);
            fetchAllProduct();
        }
    };

    const handleDeleteItem = async (itemId: string | null | undefined) => {
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
        await dispatch(logout());
        navigate('/login', { replace: false });
    }

    return (
        <div className='bg-white shadow-md rounded-lg p-4 md:p-6'>
            <h2 className='text-xl font-bold mb-4'>Inventory</h2>
            <div className='flex flex-col md:flex-row md:justify-between mb-4 space-y-2 md:space-y-0'>
                {isAdmin&&
                <button
                    onClick={() => setIsModalOpen(true)}
                    className='px-4 py-2 bg-green-500 text-white rounded w-full md:w-auto'
                >
                    Add Item
                </button>
}
                <input
                    type="text"
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className='px-4 py-2 border rounded-md w-full md:w-64'
                />
                {isAdmin&&
                <button
                    onClick={generatePDF}
                    className='px-4 py-2 bg-blue-500 text-white rounded w-full md:w-auto'
                >
                    Download PDF
                </button>
}
                <button
                    onClick={handleLogout}
                    className='px-4 py-2 bg-red-500 text-white rounded w-full md:w-auto'
                >
                    Logout
                </button>
            </div>

            <div className='overflow-x-auto'>
                <table className='min-w-full bg-white border-collapse border border-gray-200'>
                    <thead className='bg-gray-50'>
                        <tr>
                            <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Item Name</th>
                            <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Quantity</th>
                            <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell'>Description</th>
                            {isAdmin&&<th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Actions</th>}
                        </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200'>
                        {paginatedItems.map(item => (
                            <tr key={item._id}>
                                <td className='px-4 py-2 whitespace-nowrap'>
                                    <div className='text-sm text-gray-900'>{item.name}</div>
                                </td>
                                <td className='px-4 py-2 whitespace-nowrap'>
                                    <div className='text-sm text-gray-900'>{item.quantity}</div>
                                </td>
                                <td className='px-4 py-2 whitespace-nowrap hidden md:table-cell'>
                                    <div className='text-sm text-gray-900 truncate max-w-xs'>{item.description}</div>
                                </td>
                                {isAdmin&&
                                <td className='px-4 py-2 whitespace-nowrap'>
                                    <button onClick={() => handleEditClick(item)} className='px-2 py-1 text-xs bg-blue-500 text-white rounded mr-1'>Edit</button>
                                    <button onClick={() => handleDeleteItem(item?._id)} className='px-2 py-1 text-xs bg-red-500 text-white rounded'>Delete</button>
                                </td>
}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className='flex justify-between mt-4'>
                <button onClick={handlePreviousPage} className='px-3 py-1 border rounded-md bg-gray-200' disabled={currentPage === 1}>Previous</button>
                <span>Page {currentPage} of {totalPages}</span>
                <button onClick={handleNextPage} className='px-3 py-1 border rounded-md bg-gray-200' disabled={currentPage === totalPages}>Next</button>
            </div>

            <AddItemModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddItem={handleAddItem} />

            <EditItemModal 
                isOpen={isEditModalOpen} 
                onClose={() => setIsEditModalOpen(false)} 
                onEditItem={handleEditItem} 
                item={editingItem} 
            />
        </div>
    );
};

export default InventoryTable;