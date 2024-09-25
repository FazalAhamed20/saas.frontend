import React, { useEffect, useState } from 'react';
import { AppDispatch } from '../../redux/Store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchItem } from '../../redux/actions/InventoryActions';

interface Item {
  id: string;
  name: string;
  quantity: number;
  description: string;
  price: number;
  category: string;
  userId:string
}

interface AvailableItem {
  name: string;
  category: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (item: Item) => void;
}

const AddItemModal: React.FC<Props> = ({ isOpen, onClose, onAddItem }) => {
  const [newItem, setNewItem] = useState<Item>({ 
    id: '', 
    name: '', 
    quantity: 0, 
    description: '', 
    price: 0,
    category: '',
    userId:''
  });
  const [availableItems, setAvailableItems] = useState<AvailableItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [isLoading,setIsLoading]=useState(false)
  
  const dispatch: AppDispatch = useDispatch();
  const userId =  useSelector((state: any) => state.auth.user?.user?.UserId);
  console.log(userId);
  

  useEffect(() => {
    if (isOpen) {
      fetchItems();
    }
  }, [isOpen]);

  const fetchItems = async () => {
    const response = await dispatch(fetchItem());
    console.log(response.payload?.data?.categories);
    
    setAvailableItems(response.payload?.data?.categories || []);
  }

  const handleItemSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedName = e.target.value;
    setSelectedItem(selectedName);

    const selectedItemData = availableItems.find(item => item.name === selectedName);
    if (selectedItemData) {
      setNewItem(prev => ({
        ...prev,
        name: selectedItemData.name,
        category: selectedItemData.category
      }));
    }
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true)
    await onAddItem({ ...newItem, id: Date.now().toString(),userId:userId });
    resetForm();
    onClose();
    setIsLoading(false)
  };

  const resetForm = () => {
    setNewItem({ id: '', name: '', quantity: 0, description: '', price: 0, category: '' ,userId:''});
    setSelectedItem('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='bg-white rounded-lg p-6 shadow-md'>
        <h3 className='text-lg font-bold mb-4'>Add New Item</h3>
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label className="block text-sm font-medium text-gray-700">Select Item</label>
            <select
              value={selectedItem}
              onChange={handleItemSelect}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              required
            >
              <option value="">Select an Item</option>
              {availableItems.map((item) => (
                <option key={item.name} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-700'>Category</label>
            <input
              type='text'
              value={newItem.category}
              readOnly
              className='mt-1 block w-full border-gray-300 rounded-md bg-gray-100'
            />
          </div>

          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-700'>Quantity</label>
            <input
              type='number'
              value={newItem.quantity}
              onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
              className='mt-1 block w-full border-gray-300 rounded-md'
              min={1}
              required
            />
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-700'>Price</label>
            <input
              type='number'
              value={newItem.price}
              onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
              className='mt-1 block w-full border-gray-300 rounded-md'
              min={0}
              step="0.01"
              required
            />
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-700'>Description</label>
            <textarea
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              className='mt-1 block w-full border-gray-300 rounded-md'
              required
            />
          </div>
          <div className='flex justify-end'>
            <button type='button' onClick={resetForm} className='px-4 py-2 bg-gray-300 text-gray-700 rounded mr-2'>
              Cancel
            </button>
            <button type='submit' className='px-4 py-2 bg-blue-500 text-white rounded' disabled={isLoading}>
              {
                isLoading ? 'Adding...' :'Add Item'
              }
             
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItemModal;