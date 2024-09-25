import React, { useState } from 'react';

interface Product {
  id: string;
  _id?: string | null;
  name: string;
  category: string;
  image: File | null; // Store the actual file
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (product: Product) => void;
  isLoading: boolean;
}

const AddProductModal: React.FC<Props> = ({ isOpen, onClose, onAddItem,isLoading }) => {
  const [newItem, setNewItem] = useState<Product>({
    id: '',
    name: '',
    category: '',
    image: null, // Store image as a File
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setNewItem({ ...newItem, image: file }); // Set the actual file here
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddItem({ ...newItem, id: Date.now().toString() });
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setNewItem({ id: '', name: '', category: '', image: null });
    setImagePreview(null);
    onClose();
  };

  if (!isOpen) return null;

  console.log(isLoading)

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-lg font-bold mb-4">Add New Item</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Item Name</label>
            <input
              type="text"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <input
              type="text"
              value={newItem.category}
              onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 block w-full border-gray-300 rounded-md"
            />
          </div>
          {imagePreview && (
            <div className="mb-4">
              <img src={imagePreview} alt="Image Preview" className="w-full h-52 rounded-md" />
            </div>
          )}
          <div className="flex justify-end">
            <button type="button" onClick={resetForm} className="px-4 py-2 bg-gray-300 text-gray-700 rounded mr-2">
              Cancel
            </button>
            <button 
              type="submit" 
              className={`px-4 py-2 ${isLoading ? 'bg-blue-300' : 'bg-blue-500'} text-white rounded`}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding...
                </div>
              ) : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
