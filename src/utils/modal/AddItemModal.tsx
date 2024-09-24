import React, { useState } from 'react';

interface Item {
  id: string;
  name: string;
  quantity: number;
  description: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (item: Item) => void;
}

const AddItemModal: React.FC<Props> = ({ isOpen, onClose, onAddItem }) => {
  const [newItem, setNewItem] = useState<Item>({ id: '', name: '', quantity: 0, description: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddItem({ ...newItem, id: Date.now().toString() }); 
    resetForm(); 
    onClose(); 
  };

  const resetForm = () => {
    setNewItem({ id: '', name: '', quantity: 0, description: '' });
    onClose(); 
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='bg-white rounded-lg p-6 shadow-md'>
        <h3 className='text-lg font-bold mb-4'>Add New Item</h3>
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-700'>Item Name</label>
            <input
              type='text'
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className='mt-1 block w-full border-gray-300 rounded-md'
              required
            />
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-700'>Quantity</label>
            <input
              type='number'
              value={newItem.quantity}
              onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
              className='mt-1 block w-full border-gray-300 rounded-md'
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
            <button type='submit' className='px-4 py-2 bg-blue-500 text-white rounded'>
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItemModal;
