import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../redux/Store';
import { fetchAllItem, orders} from '../redux/actions/InventoryActions';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useTheme } from '../context/ThemeContext';

interface Item {
  _id: string;
  name: string;
  quantity: number;
  price: number;
  description: string;
  category: string;
}

interface BillItem extends Item {
  billQuantity: number;
}

const BillManagement: React.FC<{ onBillFinalized: () => void }> = ({ onBillFinalized }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [billItems, setBillItems] = useState<BillItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch: AppDispatch = useDispatch();
  const { darkMode } = useTheme();
  const userId = useSelector((state: any) => state?.auth?.user?.user?.UserId);

  useEffect(() => {
    fetchAllProduct();
  }, []);

  const fetchAllProduct = async () => {
    const response = await dispatch(fetchAllItem({ userId }));
    if (response.payload?.success) {
      setItems(response.payload.data?.data);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToBill = (item: Item) => {
    const existingItem = billItems.find(billItem => billItem._id === item._id);
    if (existingItem) {
      setBillItems(billItems.map(billItem =>
        billItem._id === item._id ? { ...billItem, billQuantity: billItem.billQuantity + 1 } : billItem
      ));
    } else {
      setBillItems([...billItems, { ...item, billQuantity: 1 }]);
    }
  };

  const removeBillItem = (itemId: string) => {
    setBillItems(billItems.filter(item => item._id !== itemId));
  };

  const updateBillItemQuantity = (itemId: string, newQuantity: number) => {
    setBillItems(billItems.map(item =>
      item._id === itemId ? { ...item, billQuantity: newQuantity } : item
    ));
  };

  const calculateTotal = () => {
    return billItems.reduce((total, item) => total + (item.price * item.billQuantity), 0);
  };

  const generateInvoice = () => {
    const doc = new jsPDF();
    doc.text("Invoice", 14, 15);
    
    const tableColumn = ["Item", "Quantity", "Price", "Total"];
    const tableRows = billItems.map(item => [
      item.name,
      item.billQuantity,
      `${item.price}`,
      `${item.price * item.billQuantity}`
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20
    });

    const finalY = (doc as any).lastAutoTable.finalY || 20;
    doc.text(`Total: ${calculateTotal()}`, 14, finalY + 10);

    doc.save("invoice.pdf");
  };

  const finalizeBill = async () => {
    setIsLoading(true);
    try {
      console.log(billItems);
      
      for (const billItem of billItems) {
        const updatedItem: Item = {
          ...billItem,
          quantity: billItem.quantity - billItem.billQuantity
        };
        console.log(updatedItem)
        const response = await dispatch(orders(updatedItem));
        if (!response.payload?.success) {
          throw new Error(`Failed to update quantity for ${billItem.name}`);
        }
      }
      generateInvoice();
      setBillItems([]);
      await fetchAllProduct();
      toast.success('Bill finalized and inventory updated');
      onBillFinalized();
    } catch (error:any) {
      toast.error(error.message || 'An error occurred while finalizing the bill');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
  <div>
    <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>Inventory</h2>
    <input
      type="text"
      placeholder="Search items..."
      value={searchTerm}
      onChange={handleSearch}
      className={`px-4 py-2 border rounded-md w-full mb-4 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black border-gray-300'}`}
    />
    <div className="overflow-x-auto">
      <table className={`min-w-full border-collapse border ${darkMode ? 'bg-gray-800' : 'bg-white'} border-gray-200`}>
        <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
          <tr>
            <th className={`px-4 py-2 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Item Name</th>
            <th className={`px-4 py-2 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Quantity</th>
            <th className={`px-4 py-2 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Price</th>
            <th className={`px-4 py-2 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Action</th>
          </tr>
        </thead>
        <tbody className={`divide-y divide-gray-200 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          {filteredItems.map(item => (
            <tr key={item._id}>
              <td className={`px-4 py-2 whitespace-nowrap ${darkMode ? 'text-gray-300' : 'text-black'}`}>{item.name}</td>
              <td className={`px-4 py-2 whitespace-nowrap ${darkMode ? 'text-gray-300' : 'text-black'}`}>{item.quantity}</td>
              <td className={`px-4 py-2 whitespace-nowrap ${darkMode ? 'text-gray-300' : 'text-black'}`}>₹{item.price}</td>
              <td className={`px-4 py-2 whitespace-nowrap`}>
                <button
                  onClick={() => addToBill(item)}
                  className="px-2 py-1 text-xs bg-blue-500 text-white rounded"
                  disabled={item.quantity === 0}
                >
                  Add to Bill
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  <div>
    <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>Current Bill</h2>
    <div className="overflow-x-auto">
      <table className={`min-w-full border-collapse border ${darkMode ? 'bg-gray-800' : 'bg-white'} border-gray-200`}>
        <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
          <tr>
            <th className={`px-4 py-2 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Item Name</th>
            <th className={`px-4 py-2 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Quantity</th>
            <th className={`px-4 py-2 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Price</th>
            <th className={`px-4 py-2 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Total</th>
            <th className={`px-4 py-2 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Action</th>
          </tr>
        </thead>
        <tbody className={`divide-y divide-gray-200 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          {billItems.map(item => (
            <tr key={item._id}>
              <td className={`px-4 py-2 whitespace-nowrap ${darkMode ? 'text-gray-300' : 'text-black'}`}>{item.name}</td>
              <td className={`px-4 py-2 whitespace-nowrap ${darkMode ? 'text-gray-300' : 'text-black'}`}>
                <input
                  type="number"
                  value={item.billQuantity}
                  onChange={(e) => updateBillItemQuantity(item._id, parseInt(e.target.value))}
                  min="1"
                  max={item.quantity}
                  className={`w-16 px-2 py-1 border rounded ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black border-gray-300'}`}
                />
              </td>
              <td className={`px-4 py-2 whitespace-nowrap ${darkMode ? 'text-gray-300' : 'text-black'}`}>₹{item.price}</td>
              <td className={`px-4 py-2 whitespace-nowrap ${darkMode ? 'text-gray-300' : 'text-black'}`}>₹{item.price * item.billQuantity}</td>
              <td className={`px-4 py-2 whitespace-nowrap`}>
                <button
                  onClick={() => removeBillItem(item._id)}
                  className="px-2 py-1 text-xs bg-red-500 text-white rounded"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="mt-4">
      <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-black'}`}>Total: ₹{calculateTotal()}</p>
      <button
        onClick={finalizeBill}
        className="mt-2 px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
        disabled={billItems.length === 0 || isLoading}
      >
        {isLoading ? 'Finalizing...' : 'Finalize Bill'}
      </button>
    </div>
  </div>
</div>

  );
};

export default BillManagement;